using Microsoft.EntityFrameworkCore;
using SaaSTemplate.Server.Data;

// =================================================================
// 1. Service Configuration
// =================================================================
var builder = WebApplication.CreateBuilder(args);

// Add the DbContext for PostgreSQL and get the connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention());


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// =================================================================
// 2. HTTP Request Pipeline Configuration
// =================================================================
var app = builder.Build();

// Use static files for the React app
app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// When no API route matches, send the request to the React app
app.MapFallbackToFile("/index.html");

// =================================================================
// 3. Run the Application
// =================================================================
app.Run();