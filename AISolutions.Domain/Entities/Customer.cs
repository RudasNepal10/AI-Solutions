using System;
using System.Collections.Generic;

namespace AISolutions.Domain.Entities
{
    public class Customer : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Phone { get; set; }
        public string? CompanyName { get; set; }
        public string? Country { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<Inquiry> Inquiries { get; set; } = new List<Inquiry>();
        public ICollection<DemoRequest> DemoRequests { get; set; } = new List<DemoRequest>();
        public ICollection<EventRegistration> EventRegistrations { get; set; } = new List<EventRegistration>();
    }
}