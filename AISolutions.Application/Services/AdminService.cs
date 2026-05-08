using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using AISolutions.Domain.Entities;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AISolutions.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IGenericRepository<Customer> _customerRepository;
        private readonly IGenericRepository<Inquiry> _inquiryRepository;
        private readonly IGenericRepository<DemoRequest> _demoRequestRepository;
        private readonly IGenericRepository<EventRegistration> _eventRegistrationRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IUnitOfWork _unitOfWork;


        public AdminService(
            IGenericRepository<Customer> customerRepository,
            IGenericRepository<Inquiry> inquiryRepository,
            IGenericRepository<DemoRequest> demoRequestRepository,
            IGenericRepository<EventRegistration> eventRegistrationRepository,
            IGenericRepository<User> userRepository,
            IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _inquiryRepository = inquiryRepository;
            _demoRequestRepository = demoRequestRepository;
            _eventRegistrationRepository = eventRegistrationRepository;
            _userRepository = userRepository;
            _unitOfWork = unitOfWork;
        }


        public async Task<DashboardDto> GetDashboardStatsAsync()
        {
            var customers = await _customerRepository.GetAllAsync();
            var inquiries = await _inquiryRepository.GetAllAsync();
            var demoRequests = await _demoRequestRepository.GetAllAsync();
            var eventRegistrations = await _eventRegistrationRepository.GetAllAsync();

            var inquiryBreakdown = inquiries
                .GroupBy(i => i.InterestType)
                .Select(g => new InquiryBreakdownDto
                {
                    Type = g.Key,
                    Count = g.Count()
                })
                .ToList();

            return new DashboardDto
            {
                TotalCustomers = customers.Count,
                TotalInquiries = inquiries.Count,
                DemoRequestsCount = demoRequests.Count,
                EventRegistrationsCount = eventRegistrations.Count,
                InquiryBreakdown = inquiryBreakdown
            };
        }
        public async Task<bool> RegisterUserAsync(string username, string password, string role)
        {
            username = username.Trim();
            role = NormalizeRole(role);

            if (string.IsNullOrWhiteSpace(username) || username.Length > 100 || string.IsNullOrWhiteSpace(password) || password.Length < 8)
            {
                return false;
            }

            if (_userRepository.Query().Any(u => u.Username == username))
            {
                return false;
            }

            var user = new User
            {
                Username = username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = role,
                CreatedAt = System.DateTime.UtcNow
            };

            await _userRepository.AddAsync(user);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private static string NormalizeRole(string role)
        {
            var normalizedRole = string.IsNullOrWhiteSpace(role) ? "User" : role.Trim();
            var allowedRoles = new[] { "Admin", "Manager", "Editor", "User" };
            return allowedRoles.Contains(normalizedRole) ? normalizedRole : "User";
        }
    }
}
