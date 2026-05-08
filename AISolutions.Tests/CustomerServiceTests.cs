using AISolutions.Application.DTOs;
using AISolutions.Application.Interfaces;
using AISolutions.Application.Services;
using AISolutions.Domain.Entities;
using Moq;
using Xunit;

namespace AISolutions.Tests
{
    public class CustomerServiceTests
    {
        private readonly Mock<IGenericRepository<Customer>> _customerRepoMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;
        private readonly CustomerService _customerService;

        public CustomerServiceTests()
        {
            _customerRepoMock = new Mock<IGenericRepository<Customer>>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
            _customerService = new CustomerService(_customerRepoMock.Object, _unitOfWorkMock.Object);
        }

        [Fact]
        public async Task GetOrCreateCustomerAsync_ShouldCreate_WhenCustomerDoesNotExist()
        {
            // Arrange
            var email = "test@example.com";
            var name = "Test User";
            _customerRepoMock.Setup(r => r.Query()).Returns(new List<Customer>().AsQueryable());

            // Act
            var result = await _customerService.GetOrCreateCustomerAsync(email, name);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(email, result.Email);
            _customerRepoMock.Verify(r => r.AddAsync(It.IsAny<Customer>()), Times.Once);
            _unitOfWorkMock.Verify(u => u.SaveChangesAsync(), Times.Once);
        }

        [Fact]
        public async Task GetOrCreateCustomerAsync_ShouldReturnExisting_WhenCustomerExists()
        {
            // Arrange
            var email = "existing@example.com";
            var name = "Existing User";
            var existingCustomer = new Customer { Email = email, Name = name };
            _customerRepoMock.Setup(r => r.Query()).Returns(new List<Customer> { existingCustomer }.AsQueryable());

            // Act
            var result = await _customerService.GetOrCreateCustomerAsync(email, name);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(email, result.Email);
            _customerRepoMock.Verify(r => r.AddAsync(It.IsAny<Customer>()), Times.Never);
        }
    }
}
