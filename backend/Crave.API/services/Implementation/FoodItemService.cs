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

        public async Task<IEnumerable<FoodItemResponse>> GetAllFoodItemsAsync()
        {
            var foodItems = await _context.FoodItems
                .Include(f => f.Restaurant)
                .ToListAsync();

            return foodItems.Select(MapToFoodItemResponse);
        }

        public async Task<IEnumerable<FoodItemResponse>> GetFoodItemsByRestaurantAsync(int restaurantId)
        {
            var foodItems = await _context.FoodItems
                .Include(f => f.Restaurant)
                .Where(f => f.RestaurantId == restaurantId)
                .ToListAsync();

            return foodItems.Select(MapToFoodItemResponse);
        }

        public async Task<FoodItemResponse?> GetFoodItemByIdAsync(int id)
        {
            var foodItem = await _context.FoodItems
                .Include(f => f.Restaurant)
                .FirstOrDefaultAsync(f => f.Id == id);

            return foodItem != null ? MapToFoodItemResponse(foodItem) : null;
        }

        public async Task<FoodItemResponse> CreateFoodItemAsync(CreateFoodItemRequest request)
        {
            // Verify that the restaurant exists
            var restaurant = await _context.Restaurants.FindAsync(request.RestaurantId);
            if (restaurant == null)
            {
                throw new InvalidOperationException($"Restaurant with ID {request.RestaurantId} does not exist");
            }

            var foodItem = new FoodItem
            {
                Name = request.Name,
                Description = request.Description,
                Rating = request.Rating,
                RestaurantId = request.RestaurantId
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
                RestaurantName = foodItem.Restaurant?.Name ?? string.Empty
            };
        }
    }
} 