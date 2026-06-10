namespace AI.Solutions.Application.DTOs.Dashboard;

public record DashboardStatsDto
{
    public int TotalUsers { get; init; }
    public int ActiveUsers { get; init; }
    public int TotalChats { get; init; }
    public int TotalApiRequests { get; init; }
    public int ActiveSessions { get; init; }
    public int TotalBlogs { get; init; }
    public int TotalContacts { get; init; }
    public decimal EstimatedMonthlyRevenue { get; init; }
    public DateTime GeneratedAt { get; init; }
    public List<MonthlyDataDto> MonthlyData { get; init; } = new();
    public List<PlanDistributionDto> PlanDistribution { get; init; } = new();
    public List<RecentUserDto> RecentUsers { get; init; } = new();
    public List<RecentContactDto> RecentContacts { get; init; } = new();
}

public record MonthlyDataDto
{
    public string Month { get; init; } = string.Empty;
    public int Users { get; init; }
    public int Chats { get; init; }
    public int ApiRequests { get; init; }
    public decimal Revenue { get; init; }
}

public record PlanDistributionDto
{
    public string Plan { get; init; } = string.Empty;
    public int Count { get; init; }
}

public record RecentUserDto
{
    public int Id { get; init; }
    public string Name { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Plan { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}

public record RecentContactDto
{
    public int Id { get; init; }
    public string FullName { get; init; } = string.Empty;
    public string Subject { get; init; } = string.Empty;
    public bool IsResolved { get; init; }
    public DateTime CreatedAt { get; init; }
}

public record UserUsageDto
{
    public string PlanName { get; init; } = string.Empty;
    public int Used { get; init; }
    public int Limit { get; init; }
    public DateTime ResetDate { get; init; }
    public List<DailyUsageDto> DailyUsage { get; init; } = new();
}

public record DailyUsageDto
{
    public string Date { get; init; } = string.Empty;
    public int Count { get; init; }
}
