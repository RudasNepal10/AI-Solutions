using AI.Solutions.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AI.Solutions.Persistence.Data;

public class AppDbContext : IdentityUserContext<ApplicationUser, int>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<ContactMessage> ContactMessages => Set<ContactMessage>();
    public DbSet<Blog> Blogs => Set<Blog>();
    public DbSet<BlogCategory> BlogCategories => Set<BlogCategory>();
    public DbSet<BlogTag> BlogTags => Set<BlogTag>();
    
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<SoftwareSolution> SoftwareSolutions => Set<SoftwareSolution>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Review> Reviews => Set<Review>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // ── Convert all DateTime/Nullable DateTime properties to Utc ──
        var dateTimeConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime, DateTime>(
            v => v,
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc));

        var nullableDateTimeConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<DateTime?, DateTime?>(
            v => v,
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null);

        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.GetProperties())
            {
                if (property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                }
                else if (property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(nullableDateTimeConverter);
                }
            }
        }

        // ── Rename Identity tables ──
        builder.Entity<ApplicationUser>(e =>
        {
            e.ToTable("Users");
            e.HasQueryFilter(u => !u.IsDeleted);
            e.HasIndex(u => u.Email).IsUnique();
            e.Property(u => u.FirstName).HasMaxLength(100).IsRequired();
            e.Property(u => u.LastName).HasMaxLength(100).IsRequired();
        });
        builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
        builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");

        // ── RefreshToken ──
        builder.Entity<RefreshToken>(e =>
        {
            e.ToTable("RefreshTokens");
            e.HasIndex(r => r.Token).IsUnique();
            e.HasIndex(r => r.UserId);
            e.Property(r => r.Token).HasMaxLength(500).IsRequired();
            e.HasOne(r => r.User).WithMany(u => u.RefreshTokens).HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
        });


        // ── ContactMessage ──
        builder.Entity<ContactMessage>(e =>
        {
            e.ToTable("ContactMessages");
            e.HasQueryFilter(c => !c.IsDeleted);
            e.HasIndex(c => c.Email);
            e.Property(c => c.Name).HasMaxLength(200).IsRequired();
            e.Property(c => c.Email).HasMaxLength(255).IsRequired();
            e.Property(c => c.PhoneNumber).HasMaxLength(50);
            e.Property(c => c.CompanyName).HasMaxLength(200);
            e.Property(c => c.Country).HasMaxLength(100);
            e.Property(c => c.JobTitle).HasMaxLength(200);
            e.Property(c => c.JobDetails).IsRequired();
        });

        // ── Project ──
        builder.Entity<Project>(e =>
        {
            e.ToTable("Projects");
            e.HasQueryFilter(p => !p.IsDeleted);
            e.Property(p => p.Title).HasMaxLength(200).IsRequired();
            e.Property(p => p.Industry).HasMaxLength(100);
        });

        // ── SoftwareSolution ──
        builder.Entity<SoftwareSolution>(e =>
        {
            e.ToTable("SoftwareSolutions");
            e.HasQueryFilter(s => !s.IsDeleted);
            e.Property(s => s.Title).HasMaxLength(200).IsRequired();
        });

        // ── Testimonial ──
        builder.Entity<Testimonial>(e =>
        {
            e.ToTable("Testimonials");
            e.HasQueryFilter(t => !t.IsDeleted);
            e.Property(t => t.ClientName).HasMaxLength(200).IsRequired();
        });

        // ── Event ──
        builder.Entity<Event>(e =>
        {
            e.ToTable("Events");
            e.HasQueryFilter(ev => !ev.IsDeleted);
            e.Property(ev => ev.Title).HasMaxLength(200).IsRequired();
        });

        // ── Review ──
        builder.Entity<Review>(e =>
        {
            e.ToTable("Reviews");
            e.HasQueryFilter(r => !r.IsDeleted);
            e.Property(r => r.AuthorName).HasMaxLength(200).IsRequired();
            e.Property(r => r.CompanyName).HasMaxLength(200);
            e.Property(r => r.Content).IsRequired();
        });


        // ── Blog ──
        builder.Entity<Blog>(e =>
        {
            e.ToTable("Blogs");
            e.HasQueryFilter(b => !b.IsDeleted);
            e.HasIndex(b => b.Slug).IsUnique();
            e.HasIndex(b => b.AuthorId);
            e.HasIndex(b => b.CategoryId);
            e.HasIndex(b => b.IsPublished);
            e.Property(b => b.Title).HasMaxLength(300).IsRequired();
            e.Property(b => b.Slug).HasMaxLength(350).IsRequired();
            e.Property(b => b.Content).IsRequired();
            e.Property(b => b.ThumbnailUrl).HasMaxLength(500);
            e.HasOne(b => b.Author).WithMany(u => u.Blogs).HasForeignKey(b => b.AuthorId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(b => b.Category).WithMany(c => c.Blogs).HasForeignKey(b => b.CategoryId).OnDelete(DeleteBehavior.Restrict);
            e.HasMany(b => b.Tags).WithMany(t => t.Blogs).UsingEntity(j => j.ToTable("BlogTagMappings"));
        });

        // ── BlogCategory ──
        builder.Entity<BlogCategory>(e =>
        {
            e.ToTable("BlogCategories");
            e.HasQueryFilter(c => !c.IsDeleted);
            e.HasIndex(c => c.Slug).IsUnique();
            e.Property(c => c.Name).HasMaxLength(100).IsRequired();
            e.Property(c => c.Slug).HasMaxLength(150).IsRequired();
        });

        // ── BlogTag ──
        builder.Entity<BlogTag>(e =>
        {
            e.ToTable("BlogTags");
            e.HasQueryFilter(t => !t.IsDeleted);
            e.HasIndex(t => t.Slug).IsUnique();
            e.Property(t => t.Name).HasMaxLength(100).IsRequired();
            e.Property(t => t.Slug).HasMaxLength(150).IsRequired();
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        foreach (var entry in ChangeTracker.Entries<Domain.Common.BaseEntity>())
        {
            if (entry.State == EntityState.Modified)
                entry.Entity.UpdatedAt = DateTime.UtcNow;
        }
        return base.SaveChangesAsync(ct);
    }
}
