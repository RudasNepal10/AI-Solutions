using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class GalleryItem : BaseEntity
{
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string MediaUrl { get; set; }
    public string MediaType { get; set; } = "Image"; // Image or Video
    public bool IsPublished { get; set; } = true;
}
