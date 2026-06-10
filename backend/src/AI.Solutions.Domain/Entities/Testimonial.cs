using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class Testimonial : BaseEntity
{
    public string ClientName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Feedback { get; set; } = string.Empty;
    public int Rating { get; set; } = 5; // Out of 5
    public string AvatarUrl { get; set; } = string.Empty;
}
