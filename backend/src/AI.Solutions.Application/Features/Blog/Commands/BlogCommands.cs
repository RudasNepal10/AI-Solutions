using AI.Solutions.Application.DTOs.Blog;
using AI.Solutions.Shared;
using MediatR;

namespace AI.Solutions.Application.Features.Blog.Commands;

public record CreateBlogCommand(int AuthorId, string Title, string Content, string? ThumbnailUrl, int CategoryId, List<int>? TagIds) : IRequest<Result<BlogDto>>;
public record UpdateBlogCommand(int Id, string Title, string Content, string? ThumbnailUrl, int? CategoryId, bool? IsPublished, List<int>? TagIds) : IRequest<Result<BlogDto>>;
public record DeleteBlogCommand(int Id) : IRequest<Result>;
