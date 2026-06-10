using AI.Solutions.Application.DTOs.Contact;
using AI.Solutions.Application.Features.Contact.Commands;
using AI.Solutions.Application.Features.Contact.Queries;
using AI.Solutions.Shared;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AI.Solutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContactController : ControllerBase
{
    private readonly IMediator _mediator;
    public ContactController(IMediator mediator) => _mediator = mediator;

    [HttpPost]
    public async Task<IActionResult> Submit([FromBody] SubmitContactDto dto)
    {
        var result = await _mediator.Send(new SubmitContactCommand(dto.Name, dto.Email, dto.PhoneNumber, dto.CompanyName, dto.Country, dto.JobTitle, dto.JobDetails));
        if (!result.IsSuccess) return BadRequest(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<ContactMessageDto>.SuccessResponse(result.Value!, "Message sent successfully"));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpGet("messages")]
    public async Task<IActionResult> GetMessages()
    {
        var result = await _mediator.Send(new GetContactsQuery());
        return Ok(ApiResponse<List<ContactMessageDto>>.SuccessResponse(result.Value!));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpPut("{id}/resolve")]
    public async Task<IActionResult> Resolve(int id)
    {
        var result = await _mediator.Send(new ResolveContactCommand(id));
        if (!result.IsSuccess) return NotFound(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse<ContactMessageDto>.SuccessResponse(result.Value!, "Status updated"));
    }

    [Authorize(Policy = "AdminOnly")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _mediator.Send(new DeleteContactCommand(id));
        if (!result.IsSuccess) return NotFound(ApiResponse.FailureResponse(result.Error));
        return Ok(ApiResponse.SuccessResponse("Message deleted"));
    }
}
