# AI-Solutions: Intelligent Digital Employee Experience Platform

AI-Solutions is a modern web platform built using a **Next.js SPA** frontend and an **ASP.NET Core REST API** backend with **SQL Server**, structured using **Clean Architecture** patterns. **Entity Framework Core (EF Core)** is used as the Object-Relational Mapper (ORM) for database management and database queries. The platform showcase services, client reviews, contact inquiry routing, and an interactive AI virtual assistant widget, all managed through a secure, token-authenticated administration workspace.

---

## Repository Structure

```text
AISolutions/
│
├── backend/                       # ASP.NET Core 9 Web API
│   ├── src/
│   │   ├── AI.Solutions.Domain/   # Pure business entities (User, Contact, Blog, Review)
│   │   ├── AI.Solutions.Shared/   # Shared API request/response classes and exceptions
│   │   ├── AI.Solutions.Application/ # MediatR commands, queries, validators, interfaces
│   │   ├── AI.Solutions.Persistence/ # EF Core DbContext, migrations, and seed data
│   │   ├── AI.Solutions.Infrastructure/ # External integrations (JWT tokens, SMTP emails, AI)
│   │   ├── AI.Solutions.API/      # Controller endpoints, CORS, and rate limiters
│   │   └── AI.Solutions.Tests/    # xUnit automated tests verifying handlers and fallbacks
│   └── AI.Solutions.sln           # Visual Studio / dotnet Solution configuration
│
├── frontend/                      # React / Next.js SPA
│   ├── src/
│   │   ├── app/                   # Dynamic pages, slug routing, and admin layouts
│   │   ├── components/            # UI components (Zustand state-managed chatbot, modals)
│   │   ├── hooks/                 # Reusable React hooks
│   │   ├── lib/                   # API clients and helpers
│   │   └── providers/             # Global providers (theme and query clients)
│   ├── next.config.ts             # Next.js configurations and API proxy settings
│   └── package.json               # Node dependency versions
```

---

## Getting Started

### Prerequisites
Make sure your machine has the following tools installed:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [.NET SDK](https://dotnet.microsoft.com/) (v9.0.0 or higher)
- [Microsoft SQL Server](https://www.microsoft.com/en-us/sql-server/) (LocalDB or SQL Server Express)

---

### Step 1: Backend Database & Server Configuration

1. Navigate to the backend directory:
   ```bash
   cd ./backend
   ```
2. Open `src/AI.Solutions.API/appsettings.json` and configure your SQL Server Connection String.
3. Configure the RapidAPI / OpenAI endpoints and JWT secrets:
   ```json
   "RapidApi": {
     "Host": "chatgpt-api.rapidapi.com",
     "Key": "YOUR_KEY",
     "BaseUrl": "https://chatgpt-api.rapidapi.com/chat"
   },
   "Jwt": {
     "Secret": "YOUR_SECURE_JWT_SECRET_KEY_EXCEEDING_256_BITS",
     "Issuer": "AISolutionsAPI",
     "Audience": "AISolutionsClient"
   }
   ```
4. Run Entity Framework Core migrations to initialize the database schema and seed default data:
   ```bash
   dotnet ef database update --project src/AI.Solutions.Persistence --startup-project src/AI.Solutions.API
   ```
5. Launch the backend API development server:
   ```bash
   dotnet run --project src/AI.Solutions.API
   ```
   The API will listen at: `https://localhost:7178`.

---

### Step 2: Next.js Frontend Configuration

1. Navigate to the frontend directory:
   ```bash
   cd ./frontend
   ```
2. Install the required Node packages:
   ```bash
   npm install
   ```
3. Configure proxy settings inside `next.config.ts` to forward `/api` requests to your backend server (`https://localhost:7178`).
4. Start the frontend Next.js development server:
   ```bash
   npm run dev
   ```
   The public application will load at: `http://localhost:3000`.
   - Access public showcase: `http://localhost:3000/`
   - Access secure admin dashboard: `http://localhost:3000/admin` (Default: `anil@aisolution.com` / `P@ssw0rd`).

---

### Step 3: Running Automated Tests

To execute the unit and integration tests written inside the backend test suite:
1. Navigate to the backend directory:
   ```bash
   cd ./backend
   ```
2. Run the tests using the dotnet CLI:
   ```bash
   dotnet test
   ```
   This compiles the project and executes the 12 unit tests verifying auth handlers, contact submissions, and chatbot fallback logic.
