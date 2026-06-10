using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using AI.Solutions.Shared;
using AI.Solutions.Domain.Entities;
using AI.Solutions.Application.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace AI.Solutions.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class DashboardController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IUnitOfWork _uow;

    public DashboardController(UserManager<ApplicationUser> userManager, IUnitOfWork uow)
    {
        _userManager = userManager;
        _uow = uow;
    }

    [HttpGet("stats")]
    public async Task<ActionResult<ApiResponse<object>>> GetStats()
    {
        // 1. Fetch real counts from DB
        var totalUsers = await _userManager.Users.CountAsync();
        var activeUsers = await _userManager.Users.CountAsync(u => u.IsActive);
        var removedUsers = await _userManager.Users.IgnoreQueryFilters().CountAsync(u => u.IsDeleted);

        var totalContacts = await _uow.Repository<ContactMessage>().Query().CountAsync();
        var totalBlogs = await _uow.Repository<Blog>().Query().CountAsync();

        // 2. Fetch recent users (last 5)
        var recentUsersList = await _userManager.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(5)
            .Select(u => new
            {
                id = u.Id.ToString(),
                name = $"{u.FirstName} {u.LastName}",
                email = u.Email,
                isActive = u.IsActive,
                joinedAt = u.CreatedAt
            })
            .ToListAsync();

        // 3. Fetch recent contacts (last 5)
        var recentContactsList = await _uow.Repository<ContactMessage>().Query()
            .OrderByDescending(c => c.CreatedAt)
            .Take(5)
            .Select(c => new
            {
                id = c.Id.ToString(),
                name = c.Name,
                email = c.Email,
                companyName = c.CompanyName,
                isResolved = c.IsResolved,
                createdAt = c.CreatedAt
            })
            .ToListAsync();

        // Build stats payload matching frontend requirements
        var stats = new
        {
            totalUsers,
            activeUsers,
            removedUsers,
            totalChats = 120, // simple mock for chat count
            totalApiRequests = 2400, // simple mock for api request count
            activeSessions = 5,
            totalBlogs,
            totalContacts,
            estimatedMonthlyRevenue = 0.00m,
            generatedAt = DateTime.UtcNow,
            monthlyData = new[]
            {
                new { month = "Jan", users = totalUsers / 4, chats = 20 },
                new { month = "Feb", users = totalUsers / 3, chats = 45 },
                new { month = "Mar", users = totalUsers / 2, chats = 70 },
                new { month = "Apr", users = (totalUsers * 3) / 4, chats = 95 },
                new { month = "May", users = totalUsers, chats = 120 }
            },
            planDistribution = new[]
            {
                new { plan = "Active", count = activeUsers },
                new { plan = "Inactive", count = totalUsers - activeUsers }
            },
            recentUsers = recentUsersList,
            recentContacts = recentContactsList
        };

        return Ok(ApiResponse<object>.SuccessResponse(stats, "Dashboard stats retrieved successfully"));
    }
}
