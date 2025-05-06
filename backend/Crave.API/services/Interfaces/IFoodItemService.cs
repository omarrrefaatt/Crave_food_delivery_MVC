using Crave.API.DTOS.FoodItem;

namespace Crave.API.Services.Interfaces
{
    public interface IFoodItemService
    {
        Task<IEnumerable<FoodItemResponse>> GetAllFoodItemsAsync(int userId);
        Task<IEnumerable<FoodItemResponse>> GetFoodItemsByRestaurantAsync(int restaurantId);
        Task<FoodItemResponse?> GetFoodItemByIdAsync(int id);
        Task<FoodItemResponse> CreateFoodItemAsync(CreateFoodItemRequest request,int userId);
        Task<FoodItemResponse?> UpdateFoodItemAsync(int id, UpdateFoodItemRequest request);
        Task<bool> DeleteFoodItemAsync(int id);
    }
} 