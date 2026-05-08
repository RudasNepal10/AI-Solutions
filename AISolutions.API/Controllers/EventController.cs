using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AISolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetAllEvents()
        {
            var result = await _eventService.GetAllEventsAsync();
            return Ok(result);
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            var result = await _eventService.CreateEventAsync(dto);
            return Ok(result);
        }

        [HttpPost("register")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> RegisterForEvent([FromBody] RegisterEventDto dto)
        {
            var result = await _eventService.RegisterForEventAsync(dto.CustomerId, dto.EventId);
            return Ok(new { success = result });
        }

        [HttpPost("register/public")]
        [AllowAnonymous]
        public async Task<IActionResult> RegisterPublicForEvent([FromBody] PublicEventJoinDto dto)
        {
            var result = await _eventService.RegisterPublicForEventAsync(dto);
            return Ok(new { success = result });
        }
    }
}
