using AI.Solutions.Application.Interfaces;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MimeKit;

namespace AI.Solutions.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var host = _config["SmtpSettings:Host"];
            var port = int.Parse(_config["SmtpSettings:Port"] ?? "587");
            var username = _config["SmtpSettings:Username"];
            var password = _config["SmtpSettings:Password"];
            var fromEmail = _config["SmtpSettings:FromEmail"] ?? "noreply@aisolutions.com";

            if (string.IsNullOrEmpty(host))
            {
                _logger.LogWarning("SMTP host is not configured. Email to {To} with subject '{Subject}' was NOT sent.", to, subject);
                return;
            }

            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                _logger.LogWarning("SMTP credentials not configured. Email to {To} with subject '{Subject}' was NOT sent.", to, subject);
                return;
            }

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(fromEmail));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            var builder = new BodyBuilder { HtmlBody = body };
            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(host, port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(username, password);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);

            _logger.LogInformation("Email sent successfully to {To}", to);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {To}", to);
        }
    }

    public async Task SendContactNotificationAsync(string fullName, string email, string subject, string message, CancellationToken ct = default)
    {
        var adminEmail = _config["SmtpSettings:ToEmail"] ?? "roodlesnepal@gmail.com";
        var body = $@"
            <h2>New Contact Message</h2>
            <p><strong>From:</strong> {fullName} ({email})</p>
            <p><strong>Subject:</strong> {subject}</p>
            <p><strong>Message:</strong></p>
            <p>{message}</p>
            <hr />
            <p>This message was sent from the AI Solutions Contact Form.</p>";

        await SendEmailAsync(adminEmail, $"Contact Form: {subject}", body);
    }
}
