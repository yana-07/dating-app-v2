using API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(optionsBuilder =>
{
    var connectionString = builder.Configuration
        .GetConnectionString("DefaultConnection");
    optionsBuilder.UseSqlite(connectionString);
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularApp", policyBuilder =>
    {
        policyBuilder
            .WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors("AngularApp");

app.MapControllers();

app.Run();
