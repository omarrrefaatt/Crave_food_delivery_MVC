using Crave.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers().AddJsonOptions(options => 
{
    // Handle JSON serialization cycles in entity relationships
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});
Console.WriteLine(builder.Configuration.GetConnectionString("defaultConnection"));
// Register DbContext with SQL Server
builder.Services.AddDbContext<CraveDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection")));

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

// Register Swagger with better documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Crave Food Delivery API",
        Version = "v1",
        Description = "API for Crave Food Delivery Service",
        Contact = new OpenApiContact
        {
            Name = "API Support",
            Email = "support@crave.com"
        }
    });
});

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Crave API v1"));
    
    // Test endpoint only available in development
app.MapGet("/test-connection", async (CraveDbContext context) =>
{
    try
    {
        var canConnect = await context.Database.CanConnectAsync();
        if (canConnect)
        {
            // Optionally get database info
            var dbName = context.Database.GetDbConnection().Database;
            var serverName = context.Database.GetDbConnection().DataSource;
            
            return Results.Ok(new
            {
                Status = "✅ Connection Successful!",
                Database = dbName,
                Server = serverName,
                Timestamp = DateTime.Now
            });
        }
        else
        {
            return Results.Problem(
                title: "Database Connection Failed",
                detail: "Could not establish a connection to the database",
                statusCode: 500
            );
        }
    }
    catch (Exception ex)
    {
        return Results.Problem(
            title: "Database Connection Error",
            detail: ex.Message,
            statusCode: 500
        );
    }
});
}

app.UseHttpsRedirection();

// Apply CORS policy
app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();