using System;

namespace AISolutions.Domain.Entities
{
    public class EventRegistration : BaseEntity
    {
        public int CustomerId { get; set; }
        public int EventId { get; set; }
        public DateTime RegistrationDate { get; set; } = DateTime.UtcNow;

        public Customer Customer { get; set; } = null!;
        public Event Event { get; set; } = null!;
    }
}