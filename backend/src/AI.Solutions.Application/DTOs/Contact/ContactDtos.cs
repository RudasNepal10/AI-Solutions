namespace AI.Solutions.Application.DTOs.Contact;

public record SubmitContactDto(string Name, string Email, string PhoneNumber, string CompanyName, string Country, string JobTitle, string JobDetails);

public record ContactMessageDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string PhoneNumber { get; init; } = string.Empty;
    public string CompanyName { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
    public string JobTitle { get; init; } = string.Empty;
    public string JobDetails { get; init; } = string.Empty;
    public bool IsResolved { get; init; }
    public DateTime CreatedAt { get; init; }
}
