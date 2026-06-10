using System.Security.Claims;
using AI.Solutions.Application.DTOs.Auth;
using AI.Solutions.Application.Features.Auth.Commands;
using AI.Solutions.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace AI.Solutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IConfiguration _config;
    public AuthController(IMediator mediator, IConfiguration config)
    {
        _mediator = mediator;
        _config = config;
    }



    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var result = await _mediator.Send(new LoginCommand(dto.Email, dto.Password));
        if (!result.IsSuccess) return Unauthorized(ApiResponse.FailureResponse(result.Error));

        var cookieOptions = new Microsoft.AspNetCore.Http.CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict
        };
        Response.Cookies.Append("AuthToken", result.Value!.AccessToken, cookieOptions);

        // Return response without token in body
        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result.Value!, "Login successful"));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        var result = await _mediator.Send(new RefreshTokenCommand(dto.AccessToken, dto.RefreshToken));
        if (!result.IsSuccess) return Unauthorized(ApiResponse.FailureResponse(result.Error));

        var cookieOptions = new Microsoft.AspNetCore.Http.CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict
        };
        Response.Cookies.Append("AuthToken", result.Value!.AccessToken, cookieOptions);

        return Ok(ApiResponse<AuthResponseDto>.SuccessResponse(result.Value!, "Token refreshed"));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new LogoutCommand(userId));
        
        Response.Cookies.Delete("AuthToken", new Microsoft.AspNetCore.Http.CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = Microsoft.AspNetCore.Http.SameSiteMode.Strict
        });

        return Ok(ApiResponse.SuccessResponse("Logged out successfully"));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto dto)
    {
        await _mediator.Send(new ForgotPasswordCommand(dto.Email));
        return Ok(ApiResponse.SuccessResponse("If the email exists, a reset link has been sent."));
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto dto)
    {
        var result = await _mediator.Send(new ResetPasswordCommand(dto.Email, dto.Token, dto.NewPassword));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse.SuccessResponse("Password reset successful"));
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await _mediator.Send(new ChangePasswordCommand(userId, dto.CurrentPassword, dto.NewPassword));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse.SuccessResponse("Password changed successfully"));
    }
}
