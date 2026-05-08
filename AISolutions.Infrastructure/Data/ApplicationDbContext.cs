using AISolutions.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;

namespace AISolutions.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;
        public DbSet<Inquiry> Inquiries { get; set; } = null!;
        public DbSet<DemoRequest> DemoRequests { get; set; } = null!;
        public DbSet<Event> Events { get; set; } = null!;
        public DbSet<EventRegistration> EventRegistrations { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Customer>()
                .HasIndex(c => c.Email)
                .IsUnique();

            modelBuilder.Entity<User>()
                .HasIndex(u => u.Username)
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Username)
                .HasMaxLength(100)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.PasswordHash)
                .HasMaxLength(200)
                .IsRequired();

            modelBuilder.Entity<User>()
                .Property(u => u.Role)
                .HasMaxLength(32)
                .IsRequired();

            modelBuilder.Entity<EventRegistration>()
                .HasIndex(er => new { er.CustomerId, er.EventId })
                .IsUnique();

            // Seed Data
            modelBuilder.Entity<Customer>().HasData(
                new Customer { Id = 1, Name = "John Doe", Email = "john@example.com", Phone = "1234567890", CompanyName = "Tech Corp", Country = "USA", CreatedAt = new DateTime(2024, 1, 1) },
                new Customer { Id = 2, Name = "Jane Smith", Email = "jane@example.com", Phone = "0987654321", CompanyName = "Innovate LLC", Country = "UK", CreatedAt = new DateTime(2024, 1, 1) }
            );

            modelBuilder.Entity<Event>().HasData(
                new Event { Id = 1, Title = "AI in Healthcare Webinar", Description = "Learn about AI applications in healthcare.", EventDate = new DateTime(2024, 2, 1) },
                new Event { Id = 2, Title = "Future of Work Conference", Description = "Exploring how AI changes the workplace.", EventDate = new DateTime(2024, 3, 1) }
            );

            modelBuilder.Entity<Inquiry>().HasData(
                new Inquiry 
                { 
                    Id = 1, 
                    Name = "John Doe", 
                    Email = "john@example.com", 
                    Phone = "1234567890",
                    Company = "Tech Corp",
                    Country = "USA",
                    InterestType = "AI Assistant", 
                    Message = "I need an AI assistant for my website.", 
                    CreatedAt = new DateTime(2024, 1, 1) 
                },
                new Inquiry 
                { 
                    Id = 2, 
                    Name = "Jane Smith", 
                    Email = "jane@example.com", 
                    Phone = "0987654321",
                    Company = "Innovate LLC",
                    Country = "UK",
                    InterestType = "Demo", 
                    Message = "Please schedule a demo of your product.", 
                    CreatedAt = new DateTime(2024, 1, 1) 
                }
            );
        }
    }
}
