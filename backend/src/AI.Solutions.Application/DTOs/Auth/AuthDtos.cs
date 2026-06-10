namespace AI.Solutions.Application.DTOs.Auth;

public record LoginDto(string Email, string Password);
public record RefreshTokenDto(string AccessToken, string RefreshToken);
public record ForgotPasswordDto(string Email);
public record ResetPasswordDto(string Email, string Token, string NewPassword);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);

public record AuthResponseDto
{
    public int UserId { get; init; }
    public string Email { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string AccessToken { get; init; } = string.Empty;
    public string RefreshToken { get; init; } = string.Empty;
    public DateTime AccessTokenExpiry { get; init; }
}
