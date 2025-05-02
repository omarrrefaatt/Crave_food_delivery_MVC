using Crave.API.DTOS.FoodItem;

namespace Crave.API.Services.Interfaces
{
    public interface IFoodItemService
    {
        Task<IEnumerable<FoodItemResponse>> GetAllFoodItemsAsync();
        Task<IEnumerable<FoodItemResponse>> GetFoodItemsByRestaurantAsync(int restaurantId);
        Task<FoodItemResponse?> GetFoodItemByIdAsync(int id);
        Task<FoodItemResponse> CreateFoodItemAsync(CreateFoodItemRequest request);
        Task<FoodItemResponse?> UpdateFoodItemAsync(int id, UpdateFoodItemRequest request);
        Task<bool> DeleteFoodItemAsync(int id);
    }
} 