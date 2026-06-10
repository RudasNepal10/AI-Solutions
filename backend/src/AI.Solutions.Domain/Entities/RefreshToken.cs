using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class RefreshToken : BaseEntity
{
    public int UserId { get; set; }
    public string Token { get; set; } = string.Empty;
    public DateTime ExpiryDate { get; set; }
    public bool IsRevoked { get; set; } = false;

    // Navigation
    public virtual ApplicationUser User { get; set; } = null!;
}
