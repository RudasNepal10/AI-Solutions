using AI.Solutions.Application.DTOs.User;
using AI.Solutions.Application.Features.Users.Commands;
using AI.Solutions.Application.Features.Users.Queries;
using AI.Solutions.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI.Solutions.API.Controllers;

[Authorize(Policy = "AdminOnly")]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IMediator _mediator;
    public UsersController(IMediator mediator) => _mediator = mediator;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _mediator.Send(new GetUsersQuery());
        return Ok(ApiResponse<List<UserDto>>.SuccessResponse(result.Value!));
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequestDto dto)
    {
        var result = await _mediator.Send(new CreateUserCommand(dto.FirstName, dto.LastName, dto.Email, dto.Password));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, ApiResponse<UserDto>.SuccessResponse(result.Value!, "User created successfully"));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _mediator.Send(new GetUserByIdQuery(id));
        if (!result.IsSuccess) return NotFound(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<UserDto>.SuccessResponse(result.Value!));
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, dto.FirstName, dto.LastName, dto.Email, dto.IsActive));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<UserDto>.SuccessResponse(result.Value!, "User updated"));
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteUserCommand(id));
        if (!result.IsSuccess) return NotFound(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse.SuccessResponse("User deleted"));
    }



    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ToggleStatus(int id, [FromBody] ToggleStatusDto dto)
    {
        var result = await _mediator.Send(new UpdateUserCommand(id, string.Empty, string.Empty, null, dto.IsActive));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse.SuccessResponse("User status updated"));
    }

}

public record ToggleStatusDto(bool IsActive);
public record CreateUserRequestDto(string FirstName, string LastName, string Email, string Password);
