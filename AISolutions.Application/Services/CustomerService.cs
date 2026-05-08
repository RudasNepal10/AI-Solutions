using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using AISolutions.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AISolutions.Application.Services
{
    public class CustomerService : ICustomerService
    {
        private readonly IGenericRepository<Customer> _customerRepository;
        private readonly IUnitOfWork _unitOfWork;

        public CustomerService(IGenericRepository<Customer> customerRepository, IUnitOfWork unitOfWork)
        {
            _customerRepository = customerRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<CustomerDto> CreateCustomerAsync(CreateCustomerDto dto)
        {
            var existingCustomer = _customerRepository.Query().FirstOrDefault(c => c.Email == dto.Email);
            if (existingCustomer != null)
                throw new InvalidOperationException("A customer with this email already exists.");

            var customer = new Customer
            {
                Name = dto.Name,
                Email = dto.Email,
                Phone = dto.Phone,
                CompanyName = dto.CompanyName,
                Country = dto.Country
            };

            await _customerRepository.AddAsync(customer);
            await _unitOfWork.SaveChangesAsync();

            return new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Email = customer.Email,
                Phone = customer.Phone,
                CompanyName = customer.CompanyName,
                Country = customer.Country,
                CreatedAt = customer.CreatedAt
            };
        }

        public async Task<Customer> GetOrCreateCustomerAsync(string email, string name, string? phone = null, string? companyName = null, string? country = null)
        {
            var customer = _customerRepository.Query().FirstOrDefault(c => c.Email == email);
            if (customer == null)
            {
                customer = new Customer
                {
                    Name = name,
                    Email = email,
                    Phone = phone,
                    CompanyName = companyName,
                    Country = country
                };
                await _customerRepository.AddAsync(customer);
                await _unitOfWork.SaveChangesAsync();
            }
            return customer;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllCustomersAsync()
        {
            var customers = await _customerRepository.GetAllAsync();
            return customers.Select(c => new CustomerDto
            {
                Id = c.Id,
                Name = c.Name,
                Email = c.Email,
                Phone = c.Phone,
                CompanyName = c.CompanyName,
                Country = c.Country,
                CreatedAt = c.CreatedAt
            });
        }
    }
}