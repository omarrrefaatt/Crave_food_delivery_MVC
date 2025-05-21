using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.Restaurant;
using Microsoft.EntityFrameworkCore;
using Crave.API.services.Interfaces;
using Crave.API.DTOS.Reviews;

namespace Crave.API.Services.Implementation
{
    public class RestaurantService : IRestaurantService
    {
        private readonly CraveDbContext _context;
        private readonly ILogger<CardService> _logger;

        public RestaurantService(CraveDbContext context, ILogger<CardService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<RestaurantReadDto>> GetAllAsync()
        {
            var restaurants = await _context.Restaurants.Include(r => r.Reviews).ToListAsync();
            return restaurants.Select(fromRestuarantToResponse);
        }

        public async Task<RestaurantReadDto?> GetByIdAsync(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);
    
            Console.WriteLine("restaurant.Reviews: " + restaurant.Reviews);
            return restaurant != null ? fromRestuarantToResponse(restaurant) : null;
        }


        public async Task<RestaurantReadDto> CreateAsync(RestaurantCreateDto request)
        {
            var restaurantExists = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.managerId == request.userId);

            if (restaurantExists != null)
                throw new KeyNotFoundException($"Restaurant with User ID {request.userId} already exists");
            try
            {
                // Create the new card
                var restaurant = new Restaurant
                { Name = request.Name,
                    Description = request.Description,
                    Category = request.Category,
                    Rating = request.Rating,
                    AvgDeliveryTime = request.AvgDeliveryTime,
                    ContactInfo = request.ContactInfo,
                    OperatingHours = request.OperatingHours,
                    Location = request.Location,
                    ImageUrl = request.ImageUrl,
                    managerId = request.userId,
                };

                _context.Restaurants.Add(restaurant);
                await _context.SaveChangesAsync();
                return fromRestuarantToResponse(restaurant);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating card: {Message}", ex.Message);
                throw new InvalidOperationException($"Could not create card. Please try again later.");
            }
        }

        public async Task<bool> UpdateAsync(int id, RestaurantCreateDto dto, int userId)
        {
            try
            {
                var restaurant = await _context.Restaurants
                    .Include(r => r.Reviews)
                    .FirstOrDefaultAsync(r => r.Id == id);

                
                if (restaurant == null) return false;
                if (restaurant.managerId != userId) return false;

                restaurant.Name = dto.Name ?? restaurant.Name;  
                restaurant.Description = dto.Description ?? restaurant.Description; 
                restaurant.Category = dto.Category ?? restaurant.Category;
                restaurant.AvgDeliveryTime = dto.AvgDeliveryTime != 0 ? dto.AvgDeliveryTime : restaurant.AvgDeliveryTime;
                restaurant.ContactInfo = dto.ContactInfo ?? restaurant.ContactInfo;
                restaurant.OperatingHours = dto.OperatingHours  ?? restaurant.OperatingHours;
                restaurant.Location = dto.Location  ?? restaurant.Location;
                restaurant.ImageUrl = dto.ImageUrl  ?? restaurant.ImageUrl;

                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating card {CardId}: {Message}", id, ex.Message);
                throw new InvalidOperationException("Could not update card. Please try again later.");
            }
        }

        public async Task<bool> DeleteAsync(int id, int userId)
        {
            try
            {
                var restaurant = await _context.Restaurants.FindAsync(id);
                if (restaurant == null) return false;
                // if (restaurant.managerId != userId) return false;
                _context.Restaurants.Remove(restaurant);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting restaurant {restaurant}: {Message}", id, ex.Message);
                throw new InvalidOperationException("Could not delete restaurant. Please try again later.");
            }
        }

        public async Task<RestaurantDetailsDto> GetRestaurantByUserIdAsync(int userId)
        {
            var restaurant = await _context.Restaurants
                .Include(r => r.Orders)
                .FirstOrDefaultAsync(r => r.managerId == userId);

            if (restaurant == null)
                throw new KeyNotFoundException($"Restaurant with User ID {userId} not found");

            var totalOrders = restaurant.Orders?.Count() ?? 0;
            var totalSuccessOrders = restaurant.Orders?.Count(o => o.OrderStatus == "delivered") ?? 0;
            var totalCancelledOrders = restaurant.Orders?.Count(o => o.OrderStatus == "cancelled") ?? 0;
        var totalRevenue = restaurant.Orders?
            .Where(o => o.OrderStatus == "delivered")
            .Sum(o => (double)o.TotalPrice) ?? 0;


            return new RestaurantDetailsDto
            {
                Id = restaurant.Id,
                Name = restaurant.Name,
                Description = restaurant.Description,
                Category = restaurant.Category,
                Rating = restaurant.Rating,
                AvgDeliveryTime = restaurant.AvgDeliveryTime,
                ContactInfo = restaurant.ContactInfo,
                OperatingHours = restaurant.OperatingHours,
                Location = restaurant.Location,
                ImageUrl = restaurant.ImageUrl,
                totalRevnue = totalRevenue,
                totalSucsessOrders = totalSuccessOrders,
                totalOrders = totalOrders,
                totalCancelledOrders = totalCancelledOrders,
            };
        }

        




        private static RestaurantReadDto fromRestuarantToResponse(Restaurant restaurant)
        {
            return new RestaurantReadDto
            {
                Id = restaurant.Id,
                Name = restaurant.Name,
                Description = restaurant.Description,
                Category = restaurant.Category,
                Rating = restaurant.Rating,
                ManagerId = restaurant.managerId,
                AvgDeliveryTime = restaurant.AvgDeliveryTime,
                ContactInfo = restaurant.ContactInfo,
                OperatingHours = restaurant.OperatingHours,
                Location = restaurant.Location,
                ImageUrl = restaurant.ImageUrl,
                Reviews = restaurant.Reviews?.Select(r => new ReviewReadDto
                {
                    Id = r.Id,
                    RestaurantId = r.RestaurantId,
                    UserId = r.UserId,
                    Rating = r.Rating,
                    Comment = r.Comments,
                    CreatedAt = r.CreatedAt
                }).ToList()
                ,

            };
        }
 
    }
}