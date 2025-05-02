using Crave.API.Data;
using Crave.API.services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Text.Json.Serialization;
using Crave.API.Services.Interfaces;
using Crave.API.Services.Implementation;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers(options => 
{
}).AddJsonOptions(options => 
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
});
Console.WriteLine(builder.Configuration.GetConnectionString("defaultConnection"));
// Register DbContext with SQL Server
builder.Services.AddDbContext<CraveDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("defaultConnection")));

// Register services
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ICardService, CardService>();
builder.Services.AddScoped<IFoodItemService, FoodItemService>();

// Add JWT Authentication
var jwtKey = builder.Configuration["JwtSettings:SecretKey"];
var jwtIssuer = builder.Configuration["JwtSettings:Issuer"] ?? "CraveApi";
var jwtAudience = builder.Configuration["JwtSettings:Audience"] ?? "CraveClients";
if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is missing in configuration. Please add Jwt:Key to your appsettings.json file.");
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Auth failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token validated successfully");
            return Task.CompletedTask;
        }
    };
    
    // Existing validation parameters
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ClockSkew = TimeSpan.FromMinutes(5)
    };
});

// Register JwtService
builder.Services.AddScoped<JwtService>();

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
    
    // Enable XML comments for Swagger
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Configure HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => 
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Crave API v1");
        c.RoutePrefix = "swagger"; // This makes Swagger the default page
    });
    
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

// Important: These middleware components must be in this order
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors("AllowAll");

// Add Authentication middleware before Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Add a fallback route for the root path that redirects to Swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

app.Run();