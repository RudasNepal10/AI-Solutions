using System;

namespace AISolutions.Domain.Entities
{
    public class DemoRequest : BaseEntity
    {
        public int CustomerId { get; set; }
        public string InterestedIn { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }

        public Customer Customer { get; set; } = null!;
    }
}