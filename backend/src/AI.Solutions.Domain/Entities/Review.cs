using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class Review : BaseEntity
{
    public required string AuthorName { get; set; }
    public string? CompanyName { get; set; }
    public required string Content { get; set; }
    public int Rating { get; set; } = 5; // 1 to 5
    public bool IsApproved { get; set; } = false;
}
