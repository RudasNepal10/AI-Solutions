using AI.Solutions.Domain.Entities;
using AI.Solutions.Persistence.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace AI.Solutions.Persistence.Seed;

public static class DataSeeder
{
    public static async Task SeedAsync(AppDbContext context, UserManager<ApplicationUser> userManager)
    {
        // 1. Admin User
        ApplicationUser? adminUser = await userManager.FindByEmailAsync("anil@aisolution.com");
        if (adminUser == null)
        {
            adminUser = new ApplicationUser
            {
                FirstName = "Admin", LastName = "User",
                Email = "anil@aisolution.com", UserName = "anil@aisolution.com",
                EmailConfirmed = true, IsActive = true, CreatedAt = DateTime.UtcNow
            };
            await userManager.CreateAsync(adminUser, "P@ssw0rd");
        }
        else
        {
            // Force update password to ensure it matches
            var token = await userManager.GeneratePasswordResetTokenAsync(adminUser);
            await userManager.ResetPasswordAsync(adminUser, token, "P@ssw0rd");
            
            await userManager.UpdateAsync(adminUser);
        }

        // 2. Blog Categories
        if (!await context.BlogCategories.AnyAsync())
        {
            context.BlogCategories.AddRange(
                new BlogCategory { Name = "AI & Technology", Slug = "ai-technology", Description = "Latest trends in AI" },
                new BlogCategory { Name = "Getting Started", Slug = "getting-started", Description = "Guides for new users" },
                new BlogCategory { Name = "Security", Slug = "security", Description = "Cybersecurity best practices" },
                new BlogCategory { Name = "Business Insights", Slug = "business-insights", Description = "Driving growth with data" }
            );
            await context.SaveChangesAsync();
        }

        // 3. Sample Blogs
        if (!await context.Blogs.AnyAsync())
        {
            var admin = await userManager.FindByEmailAsync("anil@aisolution.com");
            var categories = await context.BlogCategories.ToListAsync();
            
            if (admin != null && categories.Any())
            {
                context.Blogs.AddRange(
                    new Blog
                    {
                        Title = "Getting Started with AI Solutions Platform",
                        Slug = "getting-started-with-ai-solutions-platform",
                        Content = "Welcome to AI Solutions! Our platform empowers businesses with cutting-edge artificial intelligence tools designed to automate workflows, generate insights, and accelerate growth.\n\n## Why AI Solutions?\n\nIn today's fast-paced business environment, leveraging AI isn't just an advantage — it's a necessity. Our platform provides:\n\n- **Intelligent Chat Assistant**: Get instant, accurate answers powered by advanced language models\n- **Smart Analytics**: Real-time dashboards with predictive insights across all your data sources\n- **Workflow Automation**: Eliminate manual tasks with AI-driven automation pipelines\n\n## Getting Started\n\n1. **Create an Account**: Sign up for free with our Starter plan\n2. **Explore the Dashboard**: Navigate to your personalized analytics dashboard\n3. **Try AI Chat**: Start a conversation with our AI assistant\n4. **Generate Reports**: Create AI-powered business reports instantly\n\n## What's Next?\n\nStay tuned for more features including custom integrations, advanced analytics modules, and enterprise-grade security enhancements. The future of business intelligence is here.",
                        CategoryId = categories.First(c => c.Slug == "getting-started").Id,
                        AuthorId = admin.Id,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-10)
                    },
                    new Blog
                    {
                        Title = "How AI is Transforming Business Analytics in 2026",
                        Slug = "how-ai-is-transforming-business-analytics-2026",
                        Content = "The landscape of business analytics is undergoing a radical transformation, driven by advances in artificial intelligence and machine learning.\n\n## Key Trends\n\n### 1. Predictive Analytics Goes Mainstream\nPredictive models are no longer reserved for data scientists. Platforms like AI Solutions make predictive analytics accessible to every team member through natural language interfaces.\n\n### 2. Real-Time Decision Making\nWith AI processing data in real-time, businesses can make informed decisions faster than ever. Our platform processes over 5 million queries daily with sub-second response times.\n\n### 3. Automated Reporting\nGone are the days of spending hours creating reports. AI can now generate comprehensive business reports in seconds, complete with insights and recommendations.\n\n### 4. Natural Language Queries\nAsk questions about your data in plain English. No SQL knowledge required — our AI understands context and delivers accurate results.\n\n## The Road Ahead\n\nAs AI continues to evolve, we expect even more sophisticated analytics capabilities. From anomaly detection to causal inference, the possibilities are endless.\n\nAt AI Solutions, we're committed to staying at the forefront of this revolution, bringing you the latest AI-powered tools to drive your business forward.",
                        CategoryId = categories.First(c => c.Slug == "ai-technology").Id,
                        AuthorId = admin.Id,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-5)
                    },
                    new Blog
                    {
                        Title = "The Rise of Generative AI in Customer Support",
                        Slug = "rise-of-generative-ai-in-customer-support",
                        Content = "Generative AI is completely reshaping how businesses handle customer support. By understanding context, tone, and sentiment, AI agents can now resolve up to 80% of routine inquiries without human intervention.\n\n## Benefits\n- **24/7 Availability**: Never miss a customer inquiry.\n- **Instant Resolution**: Reduce wait times from hours to seconds.\n- **Cost Efficiency**: Scale support without proportionally scaling headcount.",
                        CategoryId = categories.First(c => c.Slug == "ai-technology").Id,
                        AuthorId = admin.Id,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-3)
                    },
                    new Blog
                    {
                        Title = "Top 5 Cybersecurity Best Practices for 2026",
                        Slug = "top-5-cybersecurity-best-practices-2026",
                        Content = "With the increasing sophistication of cyber threats, securing your business data has never been more critical. Here are five best practices you should implement today:\n\n1. **Zero Trust Architecture**: Assume no user or device is safe.\n2. **AI-Driven Threat Detection**: Use machine learning to spot anomalies before they become breaches.\n3. **Regular Security Audits**: Continuously evaluate your security posture.\n4. **Employee Training**: The human element remains the weakest link.\n5. **Data Encryption**: Encrypt data both in transit and at rest.",
                        CategoryId = categories.First(c => c.Slug == "security").Id,
                        AuthorId = admin.Id,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-2)
                    },
                    new Blog
                    {
                        Title = "Unlocking Growth with Data-Driven Decisions",
                        Slug = "unlocking-growth-with-data-driven-decisions",
                        Content = "Data is the new oil, but only if you know how to refine it. Many businesses collect vast amounts of data but fail to derive actionable insights.\n\n## How to become data-driven:\n- Centralize your data sources.\n- Empower your team with accessible analytics tools.\n- Foster a culture where decisions are backed by data, not just intuition.",
                        CategoryId = categories.First(c => c.Slug == "business-insights").Id,
                        AuthorId = admin.Id,
                        IsPublished = true,
                        CreatedAt = DateTime.UtcNow.AddDays(-8)
                    },
                    new Blog
                    {
                        Title = "Securing Your AI Infrastructure",
                        Slug = "securing-your-ai-infrastructure",
                        Content = "As organizations rapidly adopt AI, securing the underlying infrastructure is paramount. AI models can be vulnerable to data poisoning, model inversion, and prompt injection attacks.\n\nLearn how to safeguard your machine learning models and ensure the integrity of your AI systems.",
                        CategoryId = categories.First(c => c.Slug == "security").Id,
                        AuthorId = admin.Id,
                        IsPublished = false,
                        CreatedAt = DateTime.UtcNow.AddDays(-1)
                    }
                );
                await context.SaveChangesAsync();
            }
        }

        // 7. Sample Events (Gallery)
        if (!await context.Events.AnyAsync())
        {
            context.Events.AddRange(
                new Event
                {
                    Title = "AI-Solutions Launch Event 2021",
                    Description = "The official launch of AI-Solutions.",
                    Date = DateTime.UtcNow.AddYears(-5),
                    Location = "London, UK",
                    Type = "Past",
                    PhotoGalleryUrls = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80" })
                },
                new Event
                {
                    Title = "Global Tech Summit 2023",
                    Description = "Showcasing our latest predictive analytics module.",
                    Date = DateTime.UtcNow.AddYears(-3),
                    Location = "San Francisco, CA",
                    Type = "Past",
                    PhotoGalleryUrls = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80" })
                },
                new Event
                {
                    Title = "Sunderland Innovation Awards",
                    Description = "AI-Solutions winning the best B2B SaaS startup.",
                    Date = DateTime.UtcNow.AddYears(-2),
                    Location = "Sunderland, UK",
                    Type = "Past",
                    PhotoGalleryUrls = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80" })
                },
                new Event
                {
                    Title = "AI Hackathon Finals",
                    Description = "Sponsoring the top developers building the future.",
                    Date = DateTime.UtcNow.AddMonths(-6),
                    Location = "New York, NY",
                    Type = "Past",
                    PhotoGalleryUrls = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80" })
                },
                new Event
                {
                    Title = "Product Demo Day 2024",
                    Description = "Live demonstration of our newest features.",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Location = "Virtual",
                    Type = "Past",
                    PhotoGalleryUrls = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1475721025505-2313620f4c3d?w=800&q=80" })
                },
                new Event
                {
                    Title = "Healthcare AI Conference 2025",
                    Description = "Discussing the ethical use of AI in healthcare.",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    Location = "Chicago, IL",
                    Type = "Past",
                    PhotoGalleryUrls = JsonSerializer.Serialize(new[] { "https://images.unsplash.com/photo-1551818255-e6e10975abdb?w=800&q=80" })
                }
            );
            await context.SaveChangesAsync();
        }

        // 8. Sample Testimonials (Reviews)
        if (!await context.Testimonials.AnyAsync())
        {
            context.Testimonials.AddRange(
                new Testimonial
                {
                    ClientName = "Sarah Jenkins",
                    CompanyName = "TechFlow Solutions",
                    Feedback = "AI-Solutions has completely transformed our customer service workflow. The chatbot was incredibly easy to integrate and the analytics dashboard gives us exactly what we need.",
                    Rating = 5,
                    AvatarUrl = "https://i.pravatar.cc/150?img=47"
                },
                new Testimonial
                {
                    ClientName = "Michael Chen",
                    CompanyName = "Global Logistics",
                    Feedback = "The predictive analytics feature saved us over 15% in supply chain costs in just the first quarter. Truly an enterprise-grade platform.",
                    Rating = 5,
                    AvatarUrl = "https://i.pravatar.cc/150?img=11"
                },
                new Testimonial
                {
                    ClientName = "Elena Rodriguez",
                    CompanyName = "EduSmart",
                    Feedback = "Very intuitive interface and excellent support team. We migrated from a much more expensive competitor and couldn't be happier with the results.",
                    Rating = 4,
                    AvatarUrl = "https://i.pravatar.cc/150?img=5"
                },
                new Testimonial
                {
                    ClientName = "David Smith",
                    CompanyName = "FinancePlus",
                    Feedback = "The security features and compliance standards met all our strict financial industry requirements. Highly recommend for enterprise use.",
                    Rating = 5,
                    AvatarUrl = "https://i.pravatar.cc/150?img=68"
                }
            );
            await context.SaveChangesAsync();
        }
    }
}
