using System.Text.RegularExpressions;
using AI.Solutions.Application.DTOs.Blog;
using AI.Solutions.Application.Features.Blog.Commands;
using AI.Solutions.Application.Features.Blog.Queries;
using AI.Solutions.Application.Interfaces;
using AI.Solutions.Domain.Entities;
using AI.Solutions.Shared;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace AI.Solutions.Application.Features.Blog.Handlers;

public class CreateBlogHandler : IRequestHandler<CreateBlogCommand, Result<BlogDto>>
{
    private readonly IUnitOfWork _uow;
    public CreateBlogHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<BlogDto>> Handle(CreateBlogCommand request, CancellationToken ct)
    {
        var slug = GenerateSlug(request.Title);

        // Ensure unique slug
        var existing = await _uow.Repository<Domain.Entities.Blog>().Query()
            .AnyAsync(b => b.Slug == slug && !b.IsDeleted, ct);
        if (existing)
            slug = $"{slug}-{DateTime.UtcNow.Ticks % 10000}";

        var blog = new Domain.Entities.Blog
        {
            Title = request.Title,
            Slug = slug,
            Content = request.Content,
            ThumbnailUrl = request.ThumbnailUrl,
            CategoryId = request.CategoryId,
            AuthorId = request.AuthorId,
            IsPublished = true,
            CreatedAt = DateTime.UtcNow
        };

        if (request.TagIds != null && request.TagIds.Any())
        {
            var tags = await _uow.Repository<BlogTag>().Query()
                .Where(t => request.TagIds.Contains(t.Id)).ToListAsync(ct);
            blog.Tags = tags;
        }

        await _uow.Repository<Domain.Entities.Blog>().AddAsync(blog, ct);
        await _uow.SaveChangesAsync(ct);

        // Reload to include category
        var savedBlog = await _uow.Repository<Domain.Entities.Blog>().Query()
            .Include(b => b.Category)
            .Include(b => b.Author)
            .Include(b => b.Tags)
            .FirstAsync(b => b.Id == blog.Id, ct);

        return Result<BlogDto>.Success(MapToDto(savedBlog));
    }

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant().Trim();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        slug = slug.Trim('-');
        return slug.Length > 200 ? slug[..200] : slug;
    }

    public static BlogDto MapToDto(Domain.Entities.Blog blog) => new BlogDto
    {
        Id = blog.Id, Title = blog.Title, Slug = blog.Slug,
        Content = blog.Content, ThumbnailUrl = blog.ThumbnailUrl,
        CategoryId = blog.CategoryId, CategoryName = blog.Category?.Name ?? "General",
        AuthorId = blog.AuthorId, AuthorName = $"{blog.Author?.FirstName} {blog.Author?.LastName}".Trim(),
        IsPublished = blog.IsPublished, CreatedAt = blog.CreatedAt, UpdatedAt = blog.UpdatedAt,
        Tags = blog.Tags.Select(t => new TagDto(t.Id, t.Name, t.Slug)).ToList()
    };
}

public class UpdateBlogHandler : IRequestHandler<UpdateBlogCommand, Result<BlogDto>>
{
    private readonly IUnitOfWork _uow;
    public UpdateBlogHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<BlogDto>> Handle(UpdateBlogCommand request, CancellationToken ct)
    {
        var blog = await _uow.Repository<Domain.Entities.Blog>().Query()
            .Include(b => b.Tags)
            .FirstOrDefaultAsync(b => b.Id == request.Id && !b.IsDeleted, ct);
            
        if (blog == null) return Result<BlogDto>.Failure("Blog not found.");

        blog.Title = request.Title;
        blog.Content = request.Content;
        if (request.ThumbnailUrl != null) blog.ThumbnailUrl = request.ThumbnailUrl;
        if (request.CategoryId.HasValue) blog.CategoryId = request.CategoryId.Value;
        if (request.IsPublished.HasValue) blog.IsPublished = request.IsPublished.Value;
        blog.UpdatedAt = DateTime.UtcNow;

        if (request.TagIds != null)
        {
            var tags = await _uow.Repository<BlogTag>().Query()
                .Where(t => request.TagIds.Contains(t.Id)).ToListAsync(ct);
            blog.Tags = tags;
        }

        await _uow.Repository<Domain.Entities.Blog>().UpdateAsync(blog, ct);
        await _uow.SaveChangesAsync(ct);

        var updatedBlog = await _uow.Repository<Domain.Entities.Blog>().Query()
            .Include(b => b.Category)
            .Include(b => b.Author)
            .Include(b => b.Tags)
            .FirstAsync(b => b.Id == blog.Id, ct);

        return Result<BlogDto>.Success(CreateBlogHandler.MapToDto(updatedBlog));
    }
}

public class DeleteBlogHandler : IRequestHandler<DeleteBlogCommand, Result>
{
    private readonly IUnitOfWork _uow;
    public DeleteBlogHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(DeleteBlogCommand request, CancellationToken ct)
    {
        var blog = await _uow.Repository<Domain.Entities.Blog>().GetByIdAsync(request.Id, ct);
        if (blog == null) return Result.Failure("Blog not found.");
        await _uow.Repository<Domain.Entities.Blog>().SoftDeleteAsync(blog, ct);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}

public class GetBlogsHandler : IRequestHandler<GetBlogsQuery, Result<List<BlogListDto>>>
{
    private readonly IUnitOfWork _uow;
    public GetBlogsHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<List<BlogListDto>>> Handle(GetBlogsQuery request, CancellationToken ct)
    {
        var query = _uow.Repository<Domain.Entities.Blog>().Query()
            .Include(b => b.Category)
            .Include(b => b.Author)
            .Where(b => !b.IsDeleted);

        if (!request.IncludeUnpublished)
            query = query.Where(b => b.IsPublished);

        if (!string.IsNullOrWhiteSpace(request.Search))
            query = query.Where(b => b.Title.Contains(request.Search) || b.Content.Contains(request.Search));

        if (!string.IsNullOrWhiteSpace(request.Category) && request.Category != "All")
            query = query.Where(b => b.Category.Name == request.Category || b.Category.Slug == request.Category);

        var blogs = await query
            .OrderByDescending(b => b.CreatedAt)
            .Skip((request.Page - 1) * request.PageSize)
            .Take(request.PageSize)
            .Select(b => new BlogListDto
            {
                Id = b.Id, Title = b.Title, Slug = b.Slug,
                Excerpt = b.Content.Length > 150 ? b.Content.Substring(0, 150) + "..." : b.Content,
                ThumbnailUrl = b.ThumbnailUrl, CategoryName = b.Category.Name,
                AuthorName = b.Author.FirstName + " " + b.Author.LastName,
                IsPublished = b.IsPublished, CreatedAt = b.CreatedAt
            }).ToListAsync(ct);

        return Result<List<BlogListDto>>.Success(blogs);
    }
}

public class GetBlogBySlugHandler : IRequestHandler<GetBlogBySlugQuery, Result<BlogDto>>
{
    private readonly IUnitOfWork _uow;
    public GetBlogBySlugHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<BlogDto>> Handle(GetBlogBySlugQuery request, CancellationToken ct)
    {
        var blog = await _uow.Repository<Domain.Entities.Blog>().Query()
            .Include(b => b.Author)
            .Include(b => b.Category)
            .Include(b => b.Tags)
            .FirstOrDefaultAsync(b => b.Slug == request.Slug && !b.IsDeleted, ct);

        if (blog == null) return Result<BlogDto>.Failure("Blog not found.");

        return Result<BlogDto>.Success(CreateBlogHandler.MapToDto(blog));
    }
}
