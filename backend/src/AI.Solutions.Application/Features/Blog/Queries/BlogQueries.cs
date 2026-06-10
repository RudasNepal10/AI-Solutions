using AI.Solutions.Application.DTOs.Blog;
using AI.Solutions.Shared;
using MediatR;

namespace AI.Solutions.Application.Features.Blog.Queries;

public record GetBlogsQuery(bool IncludeUnpublished = false, string? Search = null, string? Category = null, int Page = 1, int PageSize = 12) : IRequest<Result<List<BlogListDto>>>;
public record GetBlogBySlugQuery(string Slug) : IRequest<Result<BlogDto>>;
