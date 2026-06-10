using AI.Solutions.Domain.Entities;
using AI.Solutions.Persistence.Data;
using AI.Solutions.Shared;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AI.Solutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var reviews = await _context.Reviews.OrderByDescending(r => r.CreatedAt).ToListAsync();
        return Ok(ApiResponse<List<Review>>.SuccessResponse(reviews));
    }

    [HttpGet("approved")]
    public async Task<IActionResult> GetApproved()
    {
        var reviews = await _context.Reviews
            .Where(r => r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();
        return Ok(ApiResponse<List<Review>>.SuccessResponse(reviews));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        var review = new Review
        {
            AuthorName = dto.AuthorName,
            CompanyName = dto.CompanyName,
            Content = dto.Content,
            Rating = dto.Rating,
            IsApproved = false // Default to false
        };

        _context.Reviews.Add(review);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<Review>.SuccessResponse(review, "Review submitted successfully and is pending approval."));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> Approve(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound(ApiResponse.FailureResponse("Review not found"));

        review.IsApproved = true;
        await _context.SaveChangesAsync();

        return Ok(ApiResponse<Review>.SuccessResponse(review, "Review approved"));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await _context.Reviews.FindAsync(id);
        if (review == null) return NotFound(ApiResponse.FailureResponse("Review not found"));

        _context.Reviews.Remove(review);
        await _context.SaveChangesAsync();

        return Ok(ApiResponse.SuccessResponse("Review deleted"));
    }
}

public class CreateReviewDto
{
    public required string AuthorName { get; set; }
    public string? CompanyName { get; set; }
    public required string Content { get; set; }
    public int Rating { get; set; }
}
