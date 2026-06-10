using AI.Solutions.Application.DTOs.Contact;
using AI.Solutions.Application.Features.Contact.Commands;
using AI.Solutions.Application.Features.Contact.Queries;
using AI.Solutions.Application.Features.Other.Handlers;
using AI.Solutions.Application.Interfaces;
using AI.Solutions.Domain.Entities;
using AI.Solutions.Shared;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace AI.Solutions.Tests
{
    public class ContactTests
    {
        private readonly Mock<IUnitOfWork> _uowMock;
        private readonly Mock<IGenericRepository<ContactMessage>> _contactRepoMock;
        private readonly Mock<IEmailService> _emailServiceMock;

        public ContactTests()
        {
            _uowMock = new Mock<IUnitOfWork>();
            _contactRepoMock = new Mock<IGenericRepository<ContactMessage>>();
            _emailServiceMock = new Mock<IEmailService>();
            
            _uowMock.Setup(u => u.Repository<ContactMessage>())
                .Returns(_contactRepoMock.Object);
        }

        [Fact]
        public async Task SubmitContactHandler_Should_Add_ContactMessage_And_Send_Email()
        {
            // Arrange
            var handler = new SubmitContactHandler(_uowMock.Object, _emailServiceMock.Object);
            var command = new SubmitContactCommand(
                "Alice Smith",
                "alice@company.com",
                "+44 7700 900077",
                "Acme Corporation",
                "United Kingdom",
                "Chief Technology Officer",
                "Looking for a secure AI chatbot and integrations for our internal engineering workflows."
            );

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal("Alice Smith", result.Value.Name);
            Assert.Equal("alice@company.com", result.Value.Email);
            Assert.Equal("United Kingdom", result.Value.Country);

            // Verify Repository AddAsync is called with the contact message details
            _contactRepoMock.Verify(r => r.AddAsync(It.Is<ContactMessage>(c => 
                c.Name == command.Name &&
                c.Email == command.Email &&
                c.PhoneNumber == command.PhoneNumber &&
                c.CompanyName == command.CompanyName &&
                c.Country == command.Country &&
                c.JobTitle == command.JobTitle &&
                c.JobDetails == command.JobDetails
            ), It.IsAny<CancellationToken>()), Times.Once);

            // Verify SaveChangesAsync is called on UoW
            _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);

            // Verify Email Service is invoked
            _emailServiceMock.Verify(e => e.SendContactNotificationAsync(
                command.Name,
                command.Email,
                "New Inquiry",
                command.JobDetails,
                It.IsAny<CancellationToken>()
            ), Times.Once);
        }

        [Fact]
        public async Task ResolveContactHandler_Should_Toggle_IsResolved_Status()
        {
            // Arrange
            var message = new ContactMessage
            {
                Id = 42,
                Name = "John Doe",
                Email = "john@doe.com",
                IsResolved = false,
                IsDeleted = false
            };

            _contactRepoMock.Setup(r => r.GetByIdAsync(42, It.IsAny<CancellationToken>()))
                .ReturnsAsync(message);

            var handler = new ResolveContactHandler(_uowMock.Object);
            var command = new ResolveContactCommand(42);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.True(result.Value.IsResolved);

            _contactRepoMock.Verify(r => r.UpdateAsync(It.Is<ContactMessage>(c => c.Id == 42 && c.IsResolved == true), It.IsAny<CancellationToken>()), Times.Once);
            _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeleteContactHandler_Should_SoftDelete_Inquiry()
        {
            // Arrange
            var message = new ContactMessage
            {
                Id = 101,
                Name = "Spammer",
                Email = "spam@domain.com",
                IsDeleted = false
            };

            _contactRepoMock.Setup(r => r.GetByIdAsync(101, It.IsAny<CancellationToken>()))
                .ReturnsAsync(message);

            var handler = new DeleteContactHandler(_uowMock.Object);
            var command = new DeleteContactCommand(101);

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);

            _contactRepoMock.Verify(r => r.SoftDeleteAsync(It.Is<ContactMessage>(c => c.Id == 101), It.IsAny<CancellationToken>()), Times.Once);
            _uowMock.Verify(u => u.SaveChangesAsync(It.IsAny<CancellationToken>()), Times.Once);
        }
    }
}
