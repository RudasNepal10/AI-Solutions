using AI.Solutions.Application.DTOs.Contact;
using AI.Solutions.Application.DTOs.User;
using AI.Solutions.Application.Features.Contact.Commands;
using AI.Solutions.Application.Features.Contact.Queries;
using AI.Solutions.Application.Features.Users.Commands;
using AI.Solutions.Application.Features.Users.Queries;
using AI.Solutions.Application.Interfaces;
using AI.Solutions.Domain.Entities;
using AI.Solutions.Shared;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AI.Solutions.Application.Features.Other.Handlers;

// ── Contact ──
public class SubmitContactHandler : IRequestHandler<SubmitContactCommand, Result<ContactMessageDto>>
{
    private readonly IUnitOfWork _uow;
    private readonly IEmailService _emailService;
    public SubmitContactHandler(IUnitOfWork uow, IEmailService emailService) { _uow = uow; _emailService = emailService; }

    public async Task<Result<ContactMessageDto>> Handle(SubmitContactCommand request, CancellationToken ct)
    {
        var entity = new ContactMessage
        {
            Name = request.Name, Email = request.Email,
            PhoneNumber = request.PhoneNumber, CompanyName = request.CompanyName,
            Country = request.Country, JobTitle = request.JobTitle, JobDetails = request.JobDetails,
            CreatedAt = DateTime.UtcNow
        };
        await _uow.Repository<ContactMessage>().AddAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);

        // Send email notification (fire and forget, won't block)
        _ = _emailService.SendContactNotificationAsync(request.Name, request.Email, "New Inquiry", request.JobDetails, ct);

        return Result<ContactMessageDto>.Success(new ContactMessageDto
        {
            Id = entity.Id, Name = entity.Name, Email = entity.Email,
            PhoneNumber = entity.PhoneNumber, CompanyName = entity.CompanyName,
            Country = entity.Country, JobTitle = entity.JobTitle, JobDetails = entity.JobDetails,
            IsResolved = entity.IsResolved, CreatedAt = entity.CreatedAt
        });
    }
}

public class GetContactsHandler : IRequestHandler<GetContactsQuery, Result<List<ContactMessageDto>>>
{
    private readonly IUnitOfWork _uow;
    public GetContactsHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<List<ContactMessageDto>>> Handle(GetContactsQuery request, CancellationToken ct)
    {
        var items = await _uow.Repository<ContactMessage>().Query()
            .Where(c => !c.IsDeleted).OrderByDescending(c => c.CreatedAt)
            .Select(c => new ContactMessageDto
            {
                Id = c.Id, Name = c.Name, Email = c.Email,
                PhoneNumber = c.PhoneNumber, CompanyName = c.CompanyName,
                Country = c.Country, JobTitle = c.JobTitle, JobDetails = c.JobDetails,
                IsResolved = c.IsResolved, CreatedAt = c.CreatedAt
            }).ToListAsync(ct);
        return Result<List<ContactMessageDto>>.Success(items);
    }
}

public class DeleteContactHandler : IRequestHandler<DeleteContactCommand, Result>
{
    private readonly IUnitOfWork _uow;
    public DeleteContactHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result> Handle(DeleteContactCommand request, CancellationToken ct)
    {
        var entity = await _uow.Repository<ContactMessage>().GetByIdAsync(request.Id, ct);
        if (entity == null) return Result.Failure("Message not found.");
        await _uow.Repository<ContactMessage>().SoftDeleteAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);
        return Result.Success();
    }
}

public class ResolveContactHandler : IRequestHandler<ResolveContactCommand, Result<ContactMessageDto>>
{
    private readonly IUnitOfWork _uow;
    public ResolveContactHandler(IUnitOfWork uow) => _uow = uow;

    public async Task<Result<ContactMessageDto>> Handle(ResolveContactCommand request, CancellationToken ct)
    {
        var entity = await _uow.Repository<ContactMessage>().GetByIdAsync(request.Id, ct);
        if (entity == null) return Result<ContactMessageDto>.Failure("Message not found.");
        entity.IsResolved = !entity.IsResolved;
        await _uow.Repository<ContactMessage>().UpdateAsync(entity, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<ContactMessageDto>.Success(new ContactMessageDto
        {
            Id = entity.Id, Name = entity.Name, Email = entity.Email,
            PhoneNumber = entity.PhoneNumber, CompanyName = entity.CompanyName,
            Country = entity.Country, JobTitle = entity.JobTitle, JobDetails = entity.JobDetails,
            IsResolved = entity.IsResolved, CreatedAt = entity.CreatedAt
        });
    }
}

// ── Users ──
public class GetUsersHandler : IRequestHandler<GetUsersQuery, Result<List<UserDto>>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    public GetUsersHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result<List<UserDto>>> Handle(GetUsersQuery request, CancellationToken ct)
    {
        var users = await _userManager.Users.Where(u => !u.IsDeleted)
            .OrderByDescending(u => u.CreatedAt).ToListAsync(ct);

        var dtos = users.Select(u => new UserDto
        {
            Id = u.Id, FirstName = u.FirstName, LastName = u.LastName,
            Email = u.Email ?? "",
            IsActive = u.IsActive, CreatedAt = u.CreatedAt
        }).ToList();

        return Result<List<UserDto>>.Success(dtos);
    }
}

public class GetUserByIdHandler : IRequestHandler<GetUserByIdQuery, Result<UserDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    public GetUserByIdHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result<UserDto>> Handle(GetUserByIdQuery request, CancellationToken ct)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null || user.IsDeleted) return Result<UserDto>.Failure("User not found.");
        return Result<UserDto>.Success(new UserDto
        {
            Id = user.Id, FirstName = user.FirstName, LastName = user.LastName,
            Email = user.Email ?? "",
            IsActive = user.IsActive, CreatedAt = user.CreatedAt
        });
    }
}

public class UpdateUserHandler : IRequestHandler<UpdateUserCommand, Result<UserDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    public UpdateUserHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result<UserDto>> Handle(UpdateUserCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null || user.IsDeleted) return Result<UserDto>.Failure("User not found.");

        if (!string.IsNullOrEmpty(request.FirstName)) user.FirstName = request.FirstName;
        if (!string.IsNullOrEmpty(request.LastName)) user.LastName = request.LastName;
        if (!string.IsNullOrEmpty(request.Email)) { user.Email = request.Email; user.UserName = request.Email; }
        if (request.IsActive.HasValue) user.IsActive = request.IsActive.Value;
        user.UpdatedAt = DateTime.UtcNow;

        await _userManager.UpdateAsync(user);
        return Result<UserDto>.Success(new UserDto
        {
            Id = user.Id, FirstName = user.FirstName, LastName = user.LastName,
            Email = user.Email ?? "",
            IsActive = user.IsActive, CreatedAt = user.CreatedAt
        });
    }
}

public class CreateUserHandler : IRequestHandler<CreateUserCommand, Result<UserDto>>
{
    private readonly UserManager<ApplicationUser> _userManager;
    public CreateUserHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result<UserDto>> Handle(CreateUserCommand request, CancellationToken ct)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
        {
            if (existingUser.IsDeleted)
            {
                await _userManager.DeleteAsync(existingUser);
            }
            else
            {
                return Result<UserDto>.Failure("Email already in use.");
            }
        }

        var user = new ApplicationUser
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            return Result<UserDto>.Failure("Failed to create user: " + string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return Result<UserDto>.Success(new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        });
    }
}

public class DeleteUserHandler : IRequestHandler<DeleteUserCommand, Result>
{
    private readonly UserManager<ApplicationUser> _userManager;
    public DeleteUserHandler(UserManager<ApplicationUser> userManager) => _userManager = userManager;

    public async Task<Result> Handle(DeleteUserCommand request, CancellationToken ct)
    {
        var user = await _userManager.FindByIdAsync(request.Id.ToString());
        if (user == null || user.IsDeleted) return Result.Failure("User not found.");
        user.IsDeleted = true;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);
        return Result.Success();
    }
}
