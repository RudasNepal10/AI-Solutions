using AI.Solutions.Application.DTOs.Auth;
using AI.Solutions.Shared;
using MediatR;

namespace AI.Solutions.Application.Features.Auth.Commands;

// ── Register ──
// ── Login ──
public record LoginCommand(string Email, string Password) : IRequest<Result<AuthResponseDto>>;

// ── Refresh Token ──
public record RefreshTokenCommand(string AccessToken, string RefreshToken) : IRequest<Result<AuthResponseDto>>;

// ── Logout ──
public record LogoutCommand(int UserId) : IRequest<Result>;

// ── Forgot Password ──
public record ForgotPasswordCommand(string Email) : IRequest<Result>;

// ── Reset Password ──
public record ResetPasswordCommand(string Email, string Token, string NewPassword) : IRequest<Result>;

// ── Change Password ──
public record ChangePasswordCommand(int UserId, string CurrentPassword, string NewPassword) : IRequest<Result>;
