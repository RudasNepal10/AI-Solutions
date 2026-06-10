using System.Security.Claims;
using AI.Solutions.Application.DTOs.Blog;
using AI.Solutions.Application.Features.Blog.Commands;
using AI.Solutions.Application.Features.Blog.Queries;
using AI.Solutions.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI.Solutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BlogsController : ControllerBase
{
    private readonly IMediator _mediator;
    public BlogsController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? category,
        [FromQuery] int page = 1, [FromQuery] int pageSize = 12, [FromQuery] bool includeUnpublished = false)
    {
        var result = await _mediator.Send(new GetBlogsQuery(includeUnpublished, search, category, page, pageSize));
        return Ok(ApiResponse<List<BlogListDto>>.SuccessResponse(result.Value!));
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var result = await _mediator.Send(new GetBlogBySlugQuery(slug));
        if (!result.IsSuccess) return NotFound(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<BlogDto>.SuccessResponse(result.Value!));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBlogDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new CreateBlogCommand(userId, dto.Title, dto.Content, dto.ThumbnailUrl, dto.CategoryId, dto.TagIds));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<BlogDto>.SuccessResponse(result.Value!, "Blog created"));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBlogDto dto)
    {
        var result = await _mediator.Send(new UpdateBlogCommand(id, dto.Title, dto.Content, dto.ThumbnailUrl, dto.CategoryId, dto.IsPublished, dto.TagIds));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<BlogDto>.SuccessResponse(result.Value!, "Blog updated"));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteBlogCommand(id));
        if (!result.IsSuccess) return NotFound(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse.SuccessResponse("Blog deleted"));
    }
}
