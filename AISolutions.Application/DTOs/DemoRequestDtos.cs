using System;

namespace AISolutions.Application.DTOs
{
    public class DemoRequestDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public string InterestedIn { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
    }

    public class CreateDemoRequestDto
    {
        public int CustomerId { get; set; }
        public string InterestedIn { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
    }
}