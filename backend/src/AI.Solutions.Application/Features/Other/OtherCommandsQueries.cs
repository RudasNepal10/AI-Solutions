using AI.Solutions.Application.DTOs.Contact;
using AI.Solutions.Application.DTOs.Dashboard;
using AI.Solutions.Application.DTOs.User;
using AI.Solutions.Shared;
using MediatR;

namespace AI.Solutions.Application.Features.Contact.Commands
{
    public record SubmitContactCommand(string Name, string Email, string PhoneNumber, string CompanyName, string Country, string JobTitle, string JobDetails) : IRequest<Result<ContactMessageDto>>;
    public record DeleteContactCommand(int Id) : IRequest<Result>;
    public record ResolveContactCommand(int Id) : IRequest<Result<ContactMessageDto>>;
}

namespace AI.Solutions.Application.Features.Contact.Queries
{
    public record GetContactsQuery() : IRequest<Result<List<ContactMessageDto>>>;
}

namespace AI.Solutions.Application.Features.Users.Queries
{
    public record GetUsersQuery() : IRequest<Result<List<UserDto>>>;
    public record GetUserByIdQuery(int Id) : IRequest<Result<UserDto>>;
}

namespace AI.Solutions.Application.Features.Users.Commands
{
    public record CreateUserCommand(string FirstName, string LastName, string Email, string Password) : IRequest<Result<UserDto>>;
    public record UpdateUserCommand(int Id, string FirstName, string LastName, string? Email, bool? IsActive) : IRequest<Result<UserDto>>;
    public record DeleteUserCommand(int Id) : IRequest<Result>;
}
