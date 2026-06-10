namespace AI.Solutions.Application.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendContactNotificationAsync(string fullName, string email, string subject, string message, CancellationToken ct = default);
}
