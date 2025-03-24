using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using bilihanonline.Data;
using bilihan_online.Repositories;
using bilihan_online.Services;
using bilihan_online.Repositories.Interfaces;
using bilihan_online.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<bilihanonlineContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("bilihanonlineContext") ?? throw new InvalidOperationException("Connection string 'bilihanonlineContext' not found.")).EnableSensitiveDataLogging());

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddSession();

builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ISKURepository, SKURepository>();
builder.Services.AddScoped<ISKUService, SKUService>();
builder.Services.AddScoped<IPurchaseItemRepository, PurchaseItemRepository>();
builder.Services.AddScoped<IPurchaseItemService, PurchaseItemService>();

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
