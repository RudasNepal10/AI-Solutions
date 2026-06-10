using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class Event : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Type { get; set; } = "Upcoming"; // "Upcoming", "Promotional", etc.
    // Assuming a simple array/list of URLs for photo galleries, stored as JSON string
    public string PhotoGalleryUrls { get; set; } = "[]"; 
}
