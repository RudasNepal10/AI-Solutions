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
- **SQL Server** (LocalDB, Express, or full edition)

## Getting Started

```bash
# Restore dependencies
dotnet restore

# Apply database migrations
dotnet ef database update --project AISolutions.Infrastructure --startup-project AISolutions.API

# Run the API + frontend
dotnet run --project AISolutions.API
```

The app starts at **http://localhost:5214**:
- **Frontend**: http://localhost:5214 (served from `wwwroot/`)
- **Swagger UI**: http://localhost:5214/swagger

## Database

Uses **Microsoft SQL Server** with Entity Framework Core.

Default connection string in `appsettings.json`:
```
Server=(localdb)\\mssqllocaldb;Database=AISolution;Trusted_Connection=True;Encrypt=True;TrustServerCertificate=True
```

Update this to point to your SQL Server instance as needed.

## Seed Admin User

Set environment variables before running to seed an admin user:
```bash
export SEED_ADMIN_USERNAME=admin
export SEED_ADMIN_PASSWORD=YourSecurePassword123
```

## Functional Requirements

| ID | Requirement | Implementation |
|----|-------------|----------------|
| FR1 | Display software solutions | Solutions page with 4 AI solution cards |
| FR2 | Display past projects | Projects page with 6 project showcases |
| FR3 | Provide contact form | Contact page with validated form |
| FR4 | Collect user data | All forms collect and store user data |
| FR5 | Validate form input | Client-side validation on all forms |
| FR6 | Store inquiries | Contact/inquiry data stored in SQL Server |
| FR7 | Admin login | JWT-based admin authentication |
| FR8 | Admin dashboard | Dashboard with stats, customer/inquiry/user management |

## Non-Functional Requirements

| ID | Requirement | Implementation |
|----|-------------|----------------|
| NFR1 | Security | JWT auth, CORS, security headers, password hashing |
| NFR2 | Usability | Responsive design, form validation, clear navigation |
| NFR3 | Performance | Async operations, efficient queries, static file caching |

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
