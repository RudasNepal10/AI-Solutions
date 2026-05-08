using AISolutions.Application.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AISolutions.Application.Interfaces
{
    public interface IInquiryService
    {
        Task<InquiryDto> CreateInquiryAsync(CreateInquiryDto dto);
        Task<InquiryDto> CreatePublicInquiryAsync(PublicContactDto dto);
        Task<DemoRequestDto> CreateDemoRequestAsync(CreateDemoRequestDto dto);
        Task<DemoRequestDto> CreatePublicDemoRequestAsync(PublicDemoRequestDto dto);
        Task<IEnumerable<InquiryDto>> GetAllInquiriesAsync();
        Task<bool> DeleteInquiryAsync(int id);
    }
}
