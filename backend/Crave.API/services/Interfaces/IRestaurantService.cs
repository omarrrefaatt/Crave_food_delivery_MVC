using Crave.API.DTOS.Restaurant;

namespace Crave.API.services.Interfaces
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantReadDto>> GetAllAsync();
        Task<RestaurantReadDto?> GetByIdAsync(int id);
        Task<RestaurantReadDto> CreateAsync(RestaurantCreateDto request);
        Task<bool> UpdateAsync(int id, RestaurantCreateDto dto, int userId);
        Task<bool> DeleteAsync(int id, int userId);
        Task<RestaurantDetailsDto> GetRestaurantByUserIdAsync(int userId);
    }
}