using Crave.API.DTOS;
using Crave.API.Services.Interfaces;
using Crave.API.Data;
using Microsoft.EntityFrameworkCore;

namespace Crave.API.Services.Implementation
{
    public class AdminService : IAdminService
    {
        private readonly CraveDbContext _context;

        public AdminService(CraveDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AdminStatisticsResponse>> GetWebsiteStatistics()
        {
            var statistics = new AdminStatisticsResponse();

            // Get total users by role
            var users = await _context.Users.ToListAsync();
            statistics.TotalUsers = users.Count;
            statistics.TotalClients = users.Count(u => u.Role.ToLower() == "customer");
            statistics.TotalManagers = users.Count(u => u.Role.ToLower() == "restaurantowner");
            statistics.TotalAdmins = users.Count(u => u.Role.ToLower() == "admin");

            // Get total restaurants
            statistics.TotalRestaurants = await _context.Restaurants.CountAsync();

            // Get categories with restaurant count
            var categoriesWithCounts = await _context.Restaurants
                .GroupBy(r => r.Category)
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .ToDictionaryAsync(x => x.Category, x => x.Count);
            
            statistics.CategoriesNumberOfRestaurts = categoriesWithCounts;

            // Get total orders
            statistics.TotalOrders = await _context.Orders.CountAsync();

            // Get total revenue and average order value
            var orders = await _context.Orders.ToListAsync();
            statistics.TotalRevenue = orders.Sum(o => o.TotalPrice);
            statistics.AverageOrderValue = orders.Any() ? orders.Average(o => o.TotalPrice) : 0;

            // Get total food items
            statistics.TotalFoodItems = await _context.FoodItems.CountAsync();

            // Get total reviews
            statistics.TotalReviews = await _context.Reviews.CountAsync();

            return new List<AdminStatisticsResponse> { statistics };
        }
    }
}