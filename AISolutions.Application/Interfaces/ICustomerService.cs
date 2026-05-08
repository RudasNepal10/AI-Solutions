using AISolutions.Application.DTOs;
using AISolutions.Domain.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AISolutions.Application.Interfaces
{
    public interface ICustomerService
    {
        Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto);
        Task<Customer> GetOrCreateCustomerAsync(string email, string name, string? phone = null, string? companyName = null, string? country = null);
        Task<IEnumerable<CustomerDto>> GetAllCustomersAsync();
    }
}
