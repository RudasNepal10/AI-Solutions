using AISolutions.API.Middleware;
using AISolutions.Application.Interfaces;
using AISolutions.Application.Services;
using AISolutions.Domain.Entities;
using AISolutions.Infrastructure.Data;
using AISolutions.Infrastructure.Repositories;
using AISolutions.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
    options.Cookie.SameSite = SameSiteMode.Lax;
    options.Cookie.SecurePolicy = builder.Environment.IsDevelopment()
        ? CookieSecurePolicy.SameAsRequest
        : CookieSecurePolicy.Always;
});

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBConnection")));

// Dependency Injection
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<IInquiryService, InquiryService>();
builder.Services.AddScoped<IUserService, UserService>(); // Added
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IAdminService, AdminService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHttpClient<IChatbotService, OpenAIChatbotService>();

// CORS
builder.Services.AddCors(options =>
{
    var allowedOrigins = builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
        ?? new[]
        {
            "http://localhost:3000",
            "http://localhost:3001",
            "https://localhost:3000",
            "https://localhost:3001"
        };

    options.AddPolicy("FrontendCors", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials());
});

// JWT Authentication
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "AISolutions.API";
var jwtAudience = builder.Configuration["Jwt:Audience"] ?? "AISolutions.Frontend";

if (string.IsNullOrWhiteSpace(jwtKey))
{
    if (builder.Environment.IsDevelopment())
    {
        jwtKey = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        builder.Logging.AddConsole();
    }
    else
    {
        throw new InvalidOperationException("JWT key is not configured. Set JWT_KEY or Jwt:Key with at least 32 characters.");
    }
}

if (jwtKey.Length < 32)
{
    throw new InvalidOperationException("JWT key is too short. Use at least 32 characters.");
}

builder.Configuration["Jwt:Key"] = jwtKey;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
    options.FallbackPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    await dbContext.Database.MigrateAsync();

    var seedAdminPassword = Environment.GetEnvironmentVariable("SEED_ADMIN_PASSWORD")
        ?? app.Configuration["SeedAdmin:Password"];

    if (!string.IsNullOrWhiteSpace(seedAdminPassword))
    {
        var seedAdminUsername = Environment.GetEnvironmentVariable("SEED_ADMIN_USERNAME")
            ?? app.Configuration["SeedAdmin:Username"]
            ?? "admin";

        var adminUser = await dbContext.Users.FirstOrDefaultAsync(user => user.Username == seedAdminUsername);
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(seedAdminPassword);

        if (adminUser == null)
        {
            dbContext.Users.Add(new User
            {
                Username = seedAdminUsername,
                PasswordHash = passwordHash,
                Role = "Admin"
            });
        }
        else if (!BCrypt.Net.BCrypt.Verify(seedAdminPassword, adminUser.PasswordHash) || adminUser.Role != "Admin")
        {
            adminUser.PasswordHash = passwordHash;
            adminUser.Role = "Admin";
        }

        await dbContext.SaveChangesAsync();
    }
}

// Middleware pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "AISolutions API V1");
        c.RoutePrefix = "swagger";
    });
}

app.UseMiddleware<ExceptionMiddleware>();
app.Use(async (context, next) =>
{
    context.Response.Headers.TryAdd("X-Content-Type-Options", "nosniff");
    context.Response.Headers.TryAdd("X-Frame-Options", "DENY");
    context.Response.Headers.TryAdd("Referrer-Policy", "strict-origin-when-cross-origin");
    await next();
});
app.UseCors("FrontendCors");
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();
