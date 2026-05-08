using System.Collections.Generic;

namespace AISolutions.Application.DTOs
{
    public class DashboardDto
    {
        public int TotalCustomers { get; set; }
        public int TotalInquiries { get; set; }
        public int DemoRequestsCount { get; set; }
        public int EventRegistrationsCount { get; set; }
        public List<InquiryBreakdownDto> InquiryBreakdown { get; set; } = new();
    }

    public class InquiryBreakdownDto
    {
        public string Type { get; set; } = string.Empty;
        public int Count { get; set; }
    }
}