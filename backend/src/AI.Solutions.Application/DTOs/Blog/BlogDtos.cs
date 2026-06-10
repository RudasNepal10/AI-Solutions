namespace AI.Solutions.Application.DTOs.Blog;

public record CreateBlogDto(string Title, string Content, string? ThumbnailUrl, int CategoryId, List<int>? TagIds);
public record UpdateBlogDto(string Title, string Content, string? ThumbnailUrl, int? CategoryId, bool? IsPublished, List<int>? TagIds);

public record BlogDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Content { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public int CategoryId { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public string AuthorName { get; init; } = string.Empty;
    public int AuthorId { get; init; }
    public bool IsPublished { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public List<TagDto> Tags { get; init; } = new();
}

public record BlogListDto
{
    public int Id { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Slug { get; init; } = string.Empty;
    public string Excerpt { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public string CategoryName { get; init; } = string.Empty;
    public string AuthorName { get; init; } = string.Empty;
    public bool IsPublished { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record CategoryDto(int Id, string Name, string Slug, string? Description, int BlogCount);
public record TagDto(int Id, string Name, string Slug);
