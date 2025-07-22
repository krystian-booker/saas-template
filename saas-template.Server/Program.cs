using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SaaSTemplate.Server.Data;
using SaaSTemplate.Server.Model;
using SaaSTemplate.Server.Services;
using System.Text;

// =================================================================
// 1. Service Configuration
// =================================================================
var builder = WebApplication.CreateBuilder(args);
var configuration = builder.Configuration;

// Add the DbContext for PostgreSQL and get the connection string
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(connectionString)
           .UseSnakeCaseNamingConvention());

// Add Identity Services
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

// Add JWT Authentication
var authenticationBuilder = builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.SaveToken = true;
    options.RequireHttpsMetadata = false; // Set to true in production
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidAudience = configuration["JWT:ValidAudience"],
        ValidIssuer = configuration["JWT:ValidIssuer"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]))
    };
});

// Add external authentication providers based on appsettings.json
var authProviders = configuration.GetSection("Authentication:Providers");

if (authProviders.GetSection("Google:Enabled").Get<bool>())
{
    authenticationBuilder.AddGoogle(options =>
    {
        options.ClientId = authProviders.GetSection("Google:ClientId").Value;
        options.ClientSecret = authProviders.GetSection("Google:ClientSecret").Value;
    });
}
if (authProviders.GetSection("Microsoft:Enabled").Get<bool>())
{
    authenticationBuilder.AddMicrosoftAccount(options =>
    {
        options.ClientId = authProviders.GetSection("Microsoft:ClientId").Value;
        options.ClientSecret = authProviders.GetSection("Microsoft:ClientSecret").Value;
    });
}
if (authProviders.GetSection("Apple:Enabled").Get<bool>())
{
    authenticationBuilder.AddApple(options =>
    {
        options.ClientId = authProviders.GetSection("Apple:ClientId").Value;
        options.TeamId = authProviders.GetSection("Apple:TeamId").Value;
        options.KeyId = authProviders.GetSection("Apple:KeyId").Value;
        options.PrivateKey = (keyId, _) => Task.FromResult(authProviders.GetSection("Apple:PrivateKey").Value.AsMemory());
    });
}
if (authProviders.GetSection("GitHub:Enabled").Get<bool>())
{
    authenticationBuilder.AddGitHub(options =>
    {
        options.ClientId = authProviders.GetSection("GitHub:ClientId").Value;
        options.ClientSecret = authProviders.GetSection("GitHub:ClientSecret").Value;
    });
}


// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpClient<IgdbService>();
builder.Services.AddScoped<IgdbService>();

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

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// When no API route matches, send the request to the React app
app.MapFallbackToFile("/index.html");

// =================================================================
// 3. Run the Application
// =================================================================
app.Run();