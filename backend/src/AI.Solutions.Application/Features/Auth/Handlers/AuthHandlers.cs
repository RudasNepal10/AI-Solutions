using AI.Solutions.Application.DTOs.Auth;
using AI.Solutions.Application.Interfaces;
using AI.Solutions.Domain.Entities;
using AI.Solutions.Shared;
using AI.Solutions.Shared.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace AI.Solutions.Application.Features.Auth.Handlers;

public class LoginCommandHandler : IRequestHandler<Commands.LoginCommand, Result<AuthResponseDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public LoginCommandHandler(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
        ITokenService tokenService, IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AuthResponseDto>> Handle(Commands.LoginCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || user.IsDeleted)
            return Result<AuthResponseDto>.Failure("Invalid email or password.");

        if (!user.IsActive)
            return Result<AuthResponseDto>.Failure("Account is deactivated. Contact support.");

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, request.Password, lockoutOnFailure: true);
        if (signInResult.IsLockedOut)
            return Result<AuthResponseDto>.Failure("Account is locked. Try again later.");
        if (!signInResult.Succeeded)
            return Result<AuthResponseDto>.Failure("Invalid email or password.");

        await _unitOfWork.SaveChangesAsync(ct);

        var response = await _tokenService.CreateAuthResponse(user);
        return Result<AuthResponseDto>.Success(response);
    }
}

public class RefreshTokenCommandHandler : IRequestHandler<Commands.RefreshTokenCommand, Result<AuthResponseDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IUnitOfWork _unitOfWork;

    public RefreshTokenCommandHandler(UserManager<ApplicationUser> userManager, ITokenService tokenService, IUnitOfWork unitOfWork)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<AuthResponseDto>> Handle(Commands.RefreshTokenCommand request, CancellationToken ct)
    {
        var repo = _unitOfWork.Repository<RefreshToken>();
        var storedToken = (await repo.FindAsync(r => r.Token == request.RefreshToken && !r.IsRevoked, ct)).FirstOrDefault();

        if (storedToken == null || storedToken.ExpiryDate < DateTime.UtcNow)
            return Result<AuthResponseDto>.Failure("Invalid or expired refresh token.");

        // Revoke old token
        storedToken.IsRevoked = true;
        await repo.UpdateAsync(storedToken, ct);
        await _unitOfWork.SaveChangesAsync(ct);

        var user = await _userManager.FindByIdAsync(storedToken.UserId.ToString());
        if (user == null || !user.IsActive)
            return Result<AuthResponseDto>.Failure("User not found or inactive.");

        var response = await _tokenService.CreateAuthResponse(user);
        return Result<AuthResponseDto>.Success(response);
    }
}

public class LogoutCommandHandler : IRequestHandler<Commands.LogoutCommand, Result>
{
    private readonly IUnitOfWork _unitOfWork;

    public LogoutCommandHandler(IUnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

    public async Task<Result> Handle(Commands.LogoutCommand request, CancellationToken ct)
    {
        var repo = _unitOfWork.Repository<RefreshToken>();
        var tokens = await repo.FindAsync(r => r.UserId == request.UserId && !r.IsRevoked, ct);
        foreach (var token in tokens)
        {
            token.IsRevoked = true;
            await repo.UpdateAsync(token, ct);
        }
        await _unitOfWork.SaveChangesAsync(ct);
        return Result.Success();
    }
}

public class ForgotPasswordCommandHandler : IRequestHandler<Commands.ForgotPasswordCommand, Result>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ForgotPasswordCommandHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result> Handle(Commands.ForgotPasswordCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return Result.Success(); // Don't reveal whether user exists

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        // In production, send email with token. For now, log it.
        Console.WriteLine($"[ForgotPassword] Reset token for {request.Email}: {token}");
        return Result.Success();
    }
}

public class ResetPasswordCommandHandler : IRequestHandler<Commands.ResetPasswordCommand, Result>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ResetPasswordCommandHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result> Handle(Commands.ResetPasswordCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null) return Result.Failure("Invalid request.");

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        return result.Succeeded ? Result.Success() : Result.Failure("Reset failed.");
    }
}

public class ChangePasswordCommandHandler : IRequestHandler<Commands.ChangePasswordCommand, Result>
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ChangePasswordCommandHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result> Handle(Commands.ChangePasswordCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByIdAsync(request.UserId.ToString());
        if (user == null) return Result.Failure("User not found.");

        var result = await _userManager.ChangePasswordAsync(user, request.CurrentPassword, request.NewPassword);
        return result.Succeeded ? Result.Success() : Result.Failure("Password change failed.", result.Errors.Select(e => e.Description).ToList());
    }
}
