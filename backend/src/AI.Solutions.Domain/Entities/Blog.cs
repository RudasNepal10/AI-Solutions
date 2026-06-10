using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class Blog : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    
    public int CategoryId { get; set; }
    public virtual BlogCategory Category { get; set; } = null!;

    public int AuthorId { get; set; }
    public virtual ApplicationUser Author { get; set; } = null!;

    public bool IsPublished { get; set; } = false;
    public DateTime? PublishedAt { get; set; }

    public virtual ICollection<BlogTag> Tags { get; set; } = new List<BlogTag>();
}
