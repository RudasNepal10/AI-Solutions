using AI.Solutions.Application.DTOs.Auth;
using AI.Solutions.Domain.Entities;

namespace AI.Solutions.Application.Interfaces;

public interface ITokenService
{
    string GenerateAccessToken(ApplicationUser user);
    string GenerateRefreshToken();
    Task<AuthResponseDto> CreateAuthResponse(ApplicationUser user);
}

public interface IAiService
{
    Task<string> GenerateResponseAsync(string userMessage, CancellationToken ct = default);
    Task<string> GenerateReportAsync(string reportTitle, CancellationToken ct = default);
}
