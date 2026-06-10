using AI.Solutions.Application.DTOs.Auth;
using AI.Solutions.Application.Features.Auth.Commands;
using AI.Solutions.Application.Features.Auth.Handlers;
using AI.Solutions.Application.Features.Auth.Validators;
using AI.Solutions.Application.Interfaces;
using AI.Solutions.Domain.Entities;
using AI.Solutions.Shared;
using FluentValidation.TestHelper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Moq;
using System.Security.Claims;
using Xunit;

namespace AI.Solutions.Tests
{
    public class AuthTests
    {
        private readonly Mock<UserManager<ApplicationUser>> _userManagerMock;
        private readonly Mock<SignInManager<ApplicationUser>> _signInManagerMock;
        private readonly Mock<ITokenService> _tokenServiceMock;
        private readonly Mock<IUnitOfWork> _unitOfWorkMock;

        public AuthTests()
        {
            var storeMock = new Mock<IUserStore<ApplicationUser>>();
            _userManagerMock = new Mock<UserManager<ApplicationUser>>(
                storeMock.Object, null, null, null, null, null, null, null, null);

            var contextAccessorMock = new Mock<IHttpContextAccessor>();
            var claimsPrincipalFactoryMock = new Mock<IUserClaimsPrincipalFactory<ApplicationUser>>();
            _signInManagerMock = new Mock<SignInManager<ApplicationUser>>(
                _userManagerMock.Object,
                contextAccessorMock.Object,
                claimsPrincipalFactoryMock.Object,
                null, null, null, null);

            _tokenServiceMock = new Mock<ITokenService>();
            _unitOfWorkMock = new Mock<IUnitOfWork>();
        }

        [Fact]
        public void LoginCommandValidator_Should_Have_Error_When_Email_Is_Empty()
        {
            var validator = new LoginCommandValidator();
            var command = new LoginCommand("", "P@ssw0rd123");
            var result = validator.TestValidate(command);
            result.ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Fact]
        public void LoginCommandValidator_Should_Have_Error_When_Email_Is_Invalid()
        {
            var validator = new LoginCommandValidator();
            var command = new LoginCommand("invalid-email", "P@ssw0rd123");
            var result = validator.TestValidate(command);
            result.ShouldHaveValidationErrorFor(x => x.Email);
        }

        [Fact]
        public void LoginCommandValidator_Should_Not_Have_Error_When_Command_Is_Valid()
        {
            var validator = new LoginCommandValidator();
            var command = new LoginCommand("test@aisolutions.com", "P@ssw0rd123");
            var result = validator.TestValidate(command);
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public async Task LoginCommandHandler_Should_Return_Failure_When_User_Not_Found()
        {
            // Arrange
            _userManagerMock.Setup(x => x.FindByEmailAsync(It.IsAny<string>()))
                .ReturnsAsync((ApplicationUser)null!);

            var handler = new LoginCommandHandler(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _tokenServiceMock.Object,
                _unitOfWorkMock.Object);

            var command = new LoginCommand("nonexistent@test.com", "password");

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.False(result.IsSuccess);
            Assert.Equal("Invalid email or password.", result.Error);
        }

        [Fact]
        public async Task LoginCommandHandler_Should_Return_Success_When_Credentials_Are_Valid()
        {
            // Arrange
            var user = new ApplicationUser
            {
                Id = 1,
                Email = "test@aisolutions.com",
                IsActive = true,
                IsDeleted = false
            };

            _userManagerMock.Setup(x => x.FindByEmailAsync(user.Email))
                .ReturnsAsync(user);

            _signInManagerMock.Setup(x => x.CheckPasswordSignInAsync(user, "CorrectPassword", true))
                .ReturnsAsync(SignInResult.Success);

            var authDto = new AuthResponseDto
            {
                AccessToken = "access-token-jwt",
                RefreshToken = "refresh-token-uuid",
                Email = user.Email,
                UserId = user.Id
            };

            _tokenServiceMock.Setup(x => x.CreateAuthResponse(user))
                .ReturnsAsync(authDto);

            var handler = new LoginCommandHandler(
                _userManagerMock.Object,
                _signInManagerMock.Object,
                _tokenServiceMock.Object,
                _unitOfWorkMock.Object);

            var command = new LoginCommand(user.Email, "CorrectPassword");

            // Act
            var result = await handler.Handle(command, CancellationToken.None);

            // Assert
            Assert.True(result.IsSuccess);
            Assert.NotNull(result.Value);
            Assert.Equal("access-token-jwt", result.Value.AccessToken);
            Assert.Equal("refresh-token-uuid", result.Value.RefreshToken);
        }
    }
}
