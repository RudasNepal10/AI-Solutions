using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AISolutions.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatbotController : ControllerBase
    {
        private readonly IChatbotService _chatbotService;

        public ChatbotController(IChatbotService chatbotService)
        {
            _chatbotService = chatbotService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> Chat([FromBody] ChatRequestDTO request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Message))
                return BadRequest("Message cannot be empty.");

            var response = await _chatbotService.GetChatResponseAsync(request.Message);
            return Ok(new ChatResponseDTO { Response = response });
        }
    }
}
