# Bilihan Online - Order Management System

A web-based order management system built with ASP.NET Core MVC that handles purchase orders, customer management, and product inventory.

## Prerequisites

### Development Tools

- Visual Studio 2022 (Windows or Mac) or VS Code (Linux)
- .NET 8.0 SDK or later
- SQL Server 2022 or later (Use the Docker image if possible)
- Git (for version control)

### Required NuGet Packages

- Microsoft.EntityFrameworkCore (8.0.0 or later)
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools
- Microsoft.AspNetCore.Mvc.NewtonsoftJson

## Setup Instructions

1. Clone the repository

```bash
git clone https://github.com/yourusername/bilihan-online.git
cd bilihan-online
```

2. Database Setup

- Open SQL Server Management Studio
- Restore the `bilihanonlineContext-c720a1bb-b523-4b85-a273-c645573e47d2.bak` file from the `Migrations` folder.
- Update the connection string in `appsettings.json`

3. Run Migrations (Optional when using Visual Studio 2022)

```bash
dotnet ef database update
```

4. Run the Application (Optional when using Visual Studio 2022)

```bash
dotnet restore
dotnet build
dotnet run
```

## Project Structure

```
bilihan-online/
├── Controllers/          # MVC Controllers
├── Migrations           # Database backup file
├── Models/              # Data models and view models
├── Views/               # Razor views
├── Services/            # Business logic services
│   └── Interfaces/     # Service interfaces
├── Repositories/        # Data access layer
│   └── Interfaces/     # Repository interfaces
├── Data/               # EF Core context and configurations
└── wwwroot/            # Static files (CSS, JS, images)
```

## Key Features

- Purchase Order Management
- Customer Management
- Product/SKU Management
- Order Status Tracking
- Search Functionality

## Technology Stack

- Backend: ASP.NET Core MVC 8.0
- Database: SQL Server 22 Container (Docker)
- ORM: Entity Framework Core
- Frontend:
  - Bootstrap 5
  - jQuery
  - DataTables
  - Select2

## Development Guidelines

- Follow repository pattern for data access
- Implement service layer for business logic
- Use async/await for database operations
- Validate inputs using model validation
- Handle exceptions appropriately
- Follow REST principles for API endpoints

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

<!-- ## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request -->

## License

This project is licensed under individual license under .NET.
