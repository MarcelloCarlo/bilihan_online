using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using bilihanonline.Data;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<bilihanonlineContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("bilihanonlineContext") ?? throw new InvalidOperationException("Connection string 'bilihanonlineContext' not found.")).EnableSensitiveDataLogging());

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSession();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseSession();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Customer}/{action=Index}/{id?}");

app.Run();
