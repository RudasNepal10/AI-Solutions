# AI Solutions Portal

A full-stack AI Solutions Portal built with **ASP.NET Core 9** (Clean Architecture) and a vanilla **HTML/CSS/JS** frontend.

## Architecture

```
AISolutions.Domain          - Entity models (Customer, Inquiry, Event, User, etc.)
AISolutions.Application     - DTOs, service interfaces, business logic
AISolutions.Infrastructure  - EF Core DbContext, repositories, email & OpenAI services
AISolutions.API             - Controllers, middleware, frontend (wwwroot)
AISolutions.Tests           - xUnit tests with Moq
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- (Optional) SQL Server — SQLite is used by default for development

## Getting Started

```bash
# Restore dependencies
dotnet restore

# Apply database migrations (auto-applied on startup in Development)
dotnet ef database update --project AISolutions.Infrastructure --startup-project AISolutions.API

# Run the API + frontend
dotnet run --project AISolutions.API
```

The app starts at **http://localhost:5214**:
- **Frontend**: http://localhost:5214 (served from `wwwroot/`)
- **Swagger UI**: http://localhost:5214/swagger

## Database

- **Development** (default): SQLite (`AISolutions.db` in the API project folder)
- **Production**: SQL Server — set `DatabaseProvider` to `SqlServer` and update the connection string

To switch providers, update `appsettings.json`:
```json
{
  "DatabaseProvider": "SqlServer",
  "ConnectionStrings": {
    "DBConnection": "Server=...;Database=AISolution;..."
  }
}
```

## Seed Admin User

Set environment variables before running to seed an admin user:
```bash
export SEED_ADMIN_USERNAME=admin
export SEED_ADMIN_PASSWORD=YourSecurePassword123
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | Public | Login (returns JWT) |
| POST | `/api/auth/logout` | JWT | Logout |
| POST | `/api/auth/register` | Admin | Register a new user |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| GET/POST | `/api/customer` | Admin | Manage customers |
| GET/POST/DELETE | `/api/inquiry` | Mixed | Manage inquiries |
| POST | `/api/contact` | Public | Submit contact form |
| POST | `/api/demo/public` | Public | Request a demo |
| GET/POST | `/api/event` | Mixed | Manage events |
| POST | `/api/event/register/public` | Public | Register for an event |
| POST | `/api/chatbot` | Public | Chat with AI assistant |
| GET/POST/DELETE | `/api/users` | Admin | Manage users |

## Running Tests

```bash
dotnet test
```

## Configuration

- **JWT**: Set `JWT_KEY` env var or `Jwt:Key` in appsettings (min 32 chars)
- **OpenAI**: Set `OPENAI_API_KEY` env var or `OpenAI:ApiKey` in appsettings
- **Email**: Configure `EmailSettings` section or set `EMAIL_*` env vars
