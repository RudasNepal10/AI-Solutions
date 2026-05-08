using AISolutions.Application.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace AISolutions.Infrastructure.Services
{
    public class OpenAIChatbotService : IChatbotService
    {
        private static readonly JsonSerializerOptions JsonOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        private readonly HttpClient _httpClient;
        private readonly ILogger<OpenAIChatbotService> _logger;
        private readonly string _apiKey;
        private readonly string _baseUrl;
        private readonly string _model;

        public OpenAIChatbotService(
            IConfiguration config,
            HttpClient httpClient,
            ILogger<OpenAIChatbotService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            _apiKey = config["OpenAI:ApiKey"] ?? Environment.GetEnvironmentVariable("OPENAI_API_KEY") ?? string.Empty;
            _baseUrl = (config["OpenAI:BaseUrl"] ?? "https://api.openai.com").TrimEnd('/');
            _model = config["OpenAI:Model"] ?? "gpt-4.1-mini";
        }

        public async Task<string> GetChatResponseAsync(string message)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                return "OpenAI API key is not configured. Add OPENAI_API_KEY as an environment variable or set OpenAI:ApiKey in appsettings.Development.json.";
            }

            var requestBody = new
            {
                model = _model,
                messages = new[]
                {
                    new
                    {
                        role = "system",
                        content = "You are the AI-Solutions Portal assistant. Be concise, practical, and helpful about AI automation, demos, support, and customer questions."
                    },
                    new { role = "user", content = message }
                },
                temperature = 0.4,
                max_tokens = 500
            };

            using var request = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v1/chat/completions");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
            request.Content = new StringContent(JsonSerializer.Serialize(requestBody, JsonOptions), Encoding.UTF8, "application/json");

            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
            using var response = await _httpClient.SendAsync(request, cts.Token);
            var responseString = await response.Content.ReadAsStringAsync(cts.Token);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("OpenAI chat request failed with {StatusCode}: {Body}", response.StatusCode, responseString);
                return $"OpenAI API error: {(int)response.StatusCode} {response.ReasonPhrase}. Please check the API key, model, and billing access.";
            }

            using var doc = JsonDocument.Parse(responseString);
            var reply = doc.RootElement
                .GetProperty("choices")[0]
                .GetProperty("message")
                .GetProperty("content")
                .GetString();

            return string.IsNullOrWhiteSpace(reply)
                ? "I could not generate a response. Please try again."
                : reply.Trim();
        }
    }
}
