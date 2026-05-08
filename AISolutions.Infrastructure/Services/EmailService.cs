using AISolutions.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace AISolutions.Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _config;

        public EmailService(IConfiguration config)
        {
            _config = config;
        }

        public async Task SendEmailAsync(string to, string subject, string body)
        {
            var host = Environment.GetEnvironmentVariable("EMAIL_HOST") ?? _config["EmailSettings:Host"] ?? "smtp.gmail.com";
            var portValue = Environment.GetEnvironmentVariable("EMAIL_PORT") ?? _config["EmailSettings:Port"] ?? "587";
            var port = int.Parse(portValue);
            var from = Environment.GetEnvironmentVariable("EMAIL_FROM") ?? _config["EmailSettings:From"];
            var username = Environment.GetEnvironmentVariable("EMAIL_USERNAME") ?? _config["EmailSettings:Username"] ?? string.Empty;
            var password = Environment.GetEnvironmentVariable("EMAIL_PASSWORD") ?? _config["EmailSettings:Password"] ?? string.Empty;

            if (string.IsNullOrWhiteSpace(from) ||
                string.IsNullOrWhiteSpace(username) ||
                string.IsNullOrWhiteSpace(password))
            {
                throw new InvalidOperationException("Email settings are not configured. Set EmailSettings:From, Username, and Password.");
            }

            using var client = new SmtpClient(host, port);
            client.EnableSsl = true;
            client.Credentials = new NetworkCredential(username, password);

            var message = new MailMessage(from, to, subject, body);
            message.IsBodyHtml = true;

            await client.SendMailAsync(message);
        }
    }
}
