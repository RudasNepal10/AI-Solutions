using Microsoft.AspNetCore.Identity;
using System;

namespace AI.Solutions.Domain.Entities;

/// <summary>
/// Application user extending ASP.NET Identity with custom profile fields.
/// </summary>
public class ApplicationUser : IdentityUser<int>
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }

    // Navigation properties
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public virtual ICollection<Blog> Blogs { get; set; } = new List<Blog>();
}
