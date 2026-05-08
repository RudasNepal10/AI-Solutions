using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AISolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DemoController : ControllerBase
    {
        private readonly IInquiryService _inquiryService;

        public DemoController(IInquiryService inquiryService)
        {
            _inquiryService = inquiryService;
        }

        [HttpPost]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> CreateDemoRequest([FromBody] CreateDemoRequestDto dto)
        {
            var result = await _inquiryService.CreateDemoRequestAsync(dto);
            return Ok(result);
        }

        [HttpPost("public")]
        [AllowAnonymous]
        public async Task<IActionResult> CreatePublicDemoRequest([FromBody] PublicDemoRequestDto dto)
        {
            var result = await _inquiryService.CreatePublicDemoRequestAsync(dto);
            return Ok(result);
        }
    }
}
