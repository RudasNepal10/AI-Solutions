using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class ContactMessage : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string JobTitle { get; set; } = string.Empty;
    public string JobDetails { get; set; } = string.Empty;
    
    public bool IsRead { get; set; } = false;
    public bool IsResolved { get; set; } = false;
    public string? AdminResponse { get; set; }
}
