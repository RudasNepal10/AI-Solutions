using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using AISolutions.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace AISolutions.Application.Services
{
    public class InquiryService : IInquiryService
    {
        private readonly IGenericRepository<Inquiry> _inquiryRepository;
        private readonly IGenericRepository<DemoRequest> _demoRequestRepository;
        private readonly ICustomerService _customerService;
        private readonly IEmailService _emailService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly string _adminEmail;

        public InquiryService(
            IGenericRepository<Inquiry> inquiryRepository,
            IGenericRepository<DemoRequest> demoRequestRepository,
            ICustomerService customerService,
            IEmailService emailService,
            IUnitOfWork unitOfWork,
            IConfiguration configuration)
        {
            _inquiryRepository = inquiryRepository;
            _demoRequestRepository = demoRequestRepository;
            _customerService = customerService;
            _emailService = emailService;
            _unitOfWork = unitOfWork;
            _adminEmail = System.Environment.GetEnvironmentVariable("EMAIL_ADMIN_TO") ?? configuration["EmailSettings:AdminTo"] ?? string.Empty;
        }

        public async Task<InquiryDto> CreateInquiryAsync(CreateInquiryDto dto)
        {
            var inquiry = new Inquiry
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                Company = dto.Company,
                Country = dto.Country,
                InterestType = dto.InterestType,
                Message = dto.Message
            };

            await _inquiryRepository.AddAsync(inquiry);
            await _unitOfWork.SaveChangesAsync();

            try
            {
                await _emailService.SendEmailAsync(dto.Email, "Inquiry Received", $"Hello {WebUtility.HtmlEncode(dto.Name)}, thank you for your inquiry about {WebUtility.HtmlEncode(dto.InterestType)}.");
                await SendAdminInquiryEmailAsync(inquiry);
            }
            catch (System.Exception ex)
            {
                // Log error or handle gracefully
                System.Console.WriteLine($"Failed to send email: {ex.Message}");
            }

            return new InquiryDto
            {
                Id = inquiry.Id,
                Name = inquiry.Name,
                Email = inquiry.Email,
                Phone = inquiry.Phone,
                Company = inquiry.Company,
                Country = inquiry.Country,
                InterestType = inquiry.InterestType,
                Message = inquiry.Message,
                CreatedAt = inquiry.CreatedAt
            };
        }

        public async Task<InquiryDto> CreatePublicInquiryAsync(PublicContactDto dto)
        {
            var inquiry = new Inquiry
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                InterestType = "Contact",
                Message = dto.Message
            };

            await _inquiryRepository.AddAsync(inquiry);
            await _unitOfWork.SaveChangesAsync();

            try
            {
                await _emailService.SendEmailAsync(dto.Email, "Contact Request Received", $"Hello {WebUtility.HtmlEncode(dto.Name)}, we have received your message and will contact you soon.");
                await SendAdminInquiryEmailAsync(inquiry);
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"Failed to send email: {ex.Message}");
            }

            return new InquiryDto
            {
                Id = inquiry.Id,
                Name = inquiry.Name,
                Email = inquiry.Email,
                Phone = inquiry.Phone,
                InterestType = inquiry.InterestType,
                Message = inquiry.Message,
                CreatedAt = inquiry.CreatedAt
            };
        }

        public async Task<DemoRequestDto> CreateDemoRequestAsync(CreateDemoRequestDto dto)
        {
            var demoRequest = new DemoRequest
            {
                CustomerId = dto.CustomerId,
                InterestedIn = dto.InterestedIn,
                ScheduledDate = dto.ScheduledDate
            };

            await _demoRequestRepository.AddAsync(demoRequest);
            await _unitOfWork.SaveChangesAsync();

            return new DemoRequestDto
            {
                Id = demoRequest.Id,
                CustomerId = demoRequest.CustomerId,
                InterestedIn = demoRequest.InterestedIn,
                ScheduledDate = demoRequest.ScheduledDate
            };
        }

        public async Task<DemoRequestDto> CreatePublicDemoRequestAsync(PublicDemoRequestDto dto)
        {
            var customer = await _customerService.GetOrCreateCustomerAsync(dto.Email, dto.Name, dto.Phone, dto.CompanyName, dto.Country);
            var demoRequest = new DemoRequest
            {
                CustomerId = customer.Id,
                InterestedIn = dto.Interest,
                ScheduledDate = dto.PreferredDateTime
            };

            await _demoRequestRepository.AddAsync(demoRequest);
            await _unitOfWork.SaveChangesAsync();

            try
            {
                await _emailService.SendEmailAsync(dto.Email, "Demo Scheduled", $"Hello {WebUtility.HtmlEncode(dto.Name)}, your demo for {WebUtility.HtmlEncode(dto.Interest)} has been requested for {dto.PreferredDateTime}.");
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine($"Failed to send email: {ex.Message}");
            }

            return new DemoRequestDto
            {
                Id = demoRequest.Id,
                CustomerId = demoRequest.CustomerId,
                InterestedIn = demoRequest.InterestedIn,
                ScheduledDate = demoRequest.ScheduledDate
            };
        }

        public async Task<IEnumerable<InquiryDto>> GetAllInquiriesAsync()
        {
            var inquiries = await _inquiryRepository.GetAllAsync();
            return inquiries.Select(i => new InquiryDto
            {
                Id = i.Id,
                Name = i.Name,
                Email = i.Email,
                Phone = i.Phone,
                Company = i.Company,
                Country = i.Country,
                InterestType = i.InterestType,
                Message = i.Message,
                CreatedAt = i.CreatedAt
            }).OrderByDescending(i => i.CreatedAt);
        }

        public async Task<bool> DeleteInquiryAsync(int id)
        {
            var inquiry = await _inquiryRepository.GetByIdAsync(id);
            if (inquiry == null) return false;

            _inquiryRepository.Delete(inquiry);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private async Task SendAdminInquiryEmailAsync(Inquiry inquiry)
        {
            if (string.IsNullOrWhiteSpace(_adminEmail))
            {
                return;
            }

            var subject = $"New {inquiry.InterestType} inquiry from {inquiry.Name}";
            var body = $@"
                <h3>New AI-Solutions Portal Inquiry</h3>
                <p><strong>Name:</strong> {WebUtility.HtmlEncode(inquiry.Name)}</p>
                <p><strong>Email:</strong> {WebUtility.HtmlEncode(inquiry.Email)}</p>
                <p><strong>Phone:</strong> {WebUtility.HtmlEncode(inquiry.Phone)}</p>
                <p><strong>Company:</strong> {WebUtility.HtmlEncode(inquiry.Company)}</p>
                <p><strong>Country:</strong> {WebUtility.HtmlEncode(inquiry.Country)}</p>
                <p><strong>Interest:</strong> {WebUtility.HtmlEncode(inquiry.InterestType)}</p>
                <p><strong>Message:</strong></p>
                <p>{WebUtility.HtmlEncode(inquiry.Message)}</p>";

            await _emailService.SendEmailAsync(_adminEmail, subject, body);
        }
    }
}
