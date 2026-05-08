using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AISolutions.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContactController : ControllerBase
    {
        private readonly IInquiryService _inquiryService;

        public ContactController(IInquiryService inquiryService)
        {
            _inquiryService = inquiryService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> SendMessage([FromBody] PublicContactDto request)
        {
            if (request == null || string.IsNullOrEmpty(request.Email))
                return BadRequest("Invalid request.");

            await _inquiryService.CreatePublicInquiryAsync(request);

            return Ok(new { message = "Message sent successfully and stored!" });
        }
    }
}
