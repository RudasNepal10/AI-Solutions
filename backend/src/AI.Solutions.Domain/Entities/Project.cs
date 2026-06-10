using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class Project : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Industry { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string MainImageUrl { get; set; } = string.Empty;
    public string VideoUrl { get; set; } = string.Empty; // Optional video
    public string Results { get; set; } = string.Empty;
}
