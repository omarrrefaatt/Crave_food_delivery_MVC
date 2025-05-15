using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.FoodItem;
using Crave.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Crave.API.Services.Implementation
{
    public class FoodItemService : IFoodItemService
    {
        private readonly CraveDbContext _context;
        private readonly ILogger<FoodItemService> _logger;

        public FoodItemService(CraveDbContext context, ILogger<FoodItemService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<FoodItemResponse>> GetAllFoodItemsAsync(int userId)
        {
            // Check if the user is a RestaurantOwner
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.managerId == userId);

            if (restaurant == null)
            {
                throw new InvalidOperationException("User is don't have a restaurant");
            }

            // Get all food items for the restaurant
            var foodItems = await _context.FoodItems
                .Where(f => f.RestaurantId == restaurant.Id)
                .ToListAsync();

            return foodItems.Select(MapToFoodItemResponse);
        }


        public async Task<IEnumerable<FoodItemResponse>> GetFoodItemsByRestaurantAsync(int restaurantId)
        {
            var foodItems = await _context.FoodItems
                .Include(f => f.Restaurant)
                .Where(f => f.RestaurantId == restaurantId)
                .ToListAsync();

            Console.WriteLine($"Food items for restaurant {restaurantId}: {foodItems.Count}");
            return foodItems.Select(MapToFoodItemResponse);
        }

        public async Task<FoodItemResponse?> GetFoodItemByIdAsync(int id)
        {
            var foodItem = await _context.FoodItems
                .Include(f => f.Restaurant)
                .FirstOrDefaultAsync(f => f.Id == id);

            return foodItem != null ? MapToFoodItemResponse(foodItem) : null;
        }

        public async Task<FoodItemResponse> CreateFoodItemAsync(CreateFoodItemRequest request,int userId)
        {
            // Check if the user is a RestaurantOwner
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(r => r.managerId == userId);

            if (restaurant == null)
            {
                throw new InvalidOperationException("User is don't have a restaurant");
            }
            Console.WriteLine($"image url: {request.ImageUrl} ,price: {request.Price}");


            var foodItem = new FoodItem
            {
                Name = request.Name,
                Description = request.Description,
                Rating = request.Rating,
                RestaurantId = restaurant.Id,
                ImageUrl = request.ImageUrl,
                Price = request.Price
            };

            _context.FoodItems.Add(foodItem);
            await _context.SaveChangesAsync();

            // Reload the food item with restaurant data
            await _context.Entry(foodItem).Reference(f => f.Restaurant).LoadAsync();
            return MapToFoodItemResponse(foodItem);
        }

        public async Task<FoodItemResponse?> UpdateFoodItemAsync(int id, UpdateFoodItemRequest request)
        {
            var foodItem = await _context.FoodItems.FindAsync(id);
            if (foodItem == null)
            {
                return null;
            }

            // Update restaurant reference if provided
            if (request.RestaurantId.HasValue)
            {
                var restaurant = await _context.Restaurants.FindAsync(request.RestaurantId.Value);
                if (restaurant == null)
                {
                    throw new InvalidOperationException($"Restaurant with ID {request.RestaurantId.Value} does not exist");
                }
                foodItem.RestaurantId = request.RestaurantId.Value;
            }

            // Update properties if provided
            if (request.Name != null)
                foodItem.Name = request.Name;
            
            if (request.Description != null)
                foodItem.Description = request.Description;
            
            if (request.Rating.HasValue)
                foodItem.Rating = request.Rating.Value;
            if (request.ImageUrl != null)
                foodItem.ImageUrl = request.ImageUrl;
            if (request.Price.HasValue)
                foodItem.Price = request.Price.Value;

            await _context.SaveChangesAsync();

            // Reload the food item with restaurant data
            await _context.Entry(foodItem).Reference(f => f.Restaurant).LoadAsync();

            return MapToFoodItemResponse(foodItem);
        }

        public async Task<bool> DeleteFoodItemAsync(int id)
        {
            var foodItem = await _context.FoodItems.FindAsync(id);
            if (foodItem == null)
            {
                return false;
            }

            // Check if food item is referenced in any orders
            var isReferenced = await _context.OrderItems.AnyAsync(o => o.FoodItemId == id);
            if (isReferenced)
            {
                throw new InvalidOperationException("Cannot delete food item that is referenced in orders");
            }

            _context.FoodItems.Remove(foodItem);
            await _context.SaveChangesAsync();
            return true;
        }

        private static FoodItemResponse MapToFoodItemResponse(FoodItem foodItem)
        {
            return new FoodItemResponse
            {
                Id = foodItem.Id,
                Name = foodItem.Name,
                Description = foodItem.Description,
                Rating = foodItem.Rating,
                RestaurantId = foodItem.RestaurantId,
                RestaurantName = foodItem.Restaurant?.Name ?? string.Empty,
                ImageUrl = foodItem.ImageUrl,
                Price = foodItem.Price
            };
        }
    }
} 