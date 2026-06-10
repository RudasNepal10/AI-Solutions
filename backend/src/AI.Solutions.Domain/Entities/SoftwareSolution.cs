using AI.Solutions.Domain.Common;

namespace AI.Solutions.Domain.Entities;

public class SoftwareSolution : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Icon { get; set; } = string.Empty;
    public string Features { get; set; } = string.Empty; // Store as JSON or comma separated
}
