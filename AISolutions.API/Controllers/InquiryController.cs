using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AISolutions.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InquiryController : ControllerBase
    {
        private readonly IInquiryService _inquiryService;

        public InquiryController(IInquiryService inquiryService)
        {
            _inquiryService = inquiryService;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> CreateInquiry([FromBody] CreateInquiryDto dto)
        {
            var result = await _inquiryService.CreateInquiryAsync(dto);
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> GetAllInquiries()
        {
            var result = await _inquiryService.GetAllInquiriesAsync();
            return Ok(result);
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> DeleteInquiry(int id)
        {
            var result = await _inquiryService.DeleteInquiryAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
