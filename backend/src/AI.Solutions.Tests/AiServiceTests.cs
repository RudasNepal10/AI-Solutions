using AI.Solutions.Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace AI.Solutions.Tests
{
    public class AiServiceTests
    {
        private readonly Mock<IConfiguration> _configMock;
        private readonly Mock<ILogger<AiChatService>> _loggerMock;

        public AiServiceTests()
        {
            _configMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<AiChatService>>();

            // Setup default configuration
            _configMock.Setup(c => c["RapidApi:Host"]).Returns("chatgpt-api.rapidapi.com");
            _configMock.Setup(c => c["RapidApi:Key"]).Returns("mock-api-key-12345");
            _configMock.Setup(c => c["RapidApi:BaseUrl"]).Returns("https://chatgpt-api.rapidapi.com/chat");
        }

        [Fact]
        public async Task GenerateResponseAsync_Should_Return_ApiResponse_When_Call_Succeeds()
        {
            // Arrange
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            handlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent("\"Optimized database queries are averaging 45ms.\"")
                })
                .Verifiable();

            var httpClient = new HttpClient(handlerMock.Object);
            var aiService = new AiChatService(httpClient, _configMock.Object, _loggerMock.Object);

            // Act
            var response = await aiService.GenerateResponseAsync("performance", CancellationToken.None);

            // Assert
            Assert.Equal("Optimized database queries are averaging 45ms.", response);
            handlerMock.Protected().Verify(
                "SendAsync",
                Times.Once(),
                ItExpr.Is<HttpRequestMessage>(req =>
                    req.Method == HttpMethod.Get &&
                    req.Headers.Contains("x-rapidapi-host") &&
                    req.Headers.Contains("x-rapidapi-key")
                ),
                ItExpr.IsAny<CancellationToken>()
            );
        }

        [Fact]
        public async Task GenerateResponseAsync_Should_Fallback_To_Local_Rules_When_Key_Is_Missing()
        {
            // Arrange
            _configMock.Setup(c => c["RapidApi:Key"]).Returns(string.Empty); // Scrambled/empty key

            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            var httpClient = new HttpClient(handlerMock.Object);
            var aiService = new AiChatService(httpClient, _configMock.Object, _loggerMock.Object);

            // Act
            var response = await aiService.GenerateResponseAsync("price info", CancellationToken.None);

            // Assert
            Assert.Contains("We offer three plans", response);
            Assert.Contains("Starter", response);
            Assert.Contains("Pro", response);
        }

        [Fact]
        public async Task GenerateResponseAsync_Should_Retry_And_Fallback_When_Api_Returns_Error()
        {
            // Arrange
            var handlerMock = new Mock<HttpMessageHandler>(MockBehavior.Strict);
            handlerMock
                .Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.InternalServerError, // 500 error
                    Content = new StringContent("Service Unavailable")
                });

            var httpClient = new HttpClient(handlerMock.Object);
            var aiService = new AiChatService(httpClient, _configMock.Object, _loggerMock.Object);

            // Act
            // Trigger with query that matches "help" fallback
            var response = await aiService.GenerateResponseAsync("please help me", CancellationToken.None);

            // Assert
            Assert.Contains("I can help you with", response);
            Assert.Contains("Workflow automation", response);

            // Verify HttpClient attempted API call 3 times (due to retry loop)
            handlerMock.Protected().Verify(
                "SendAsync",
                Times.Exactly(3),
                ItExpr.IsAny<HttpRequestMessage>(),
                ItExpr.IsAny<CancellationToken>()
            );
        }
    }
}
