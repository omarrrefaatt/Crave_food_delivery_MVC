using Crave.API.Dtos;

namespace Crave.API.services.Interfaces
{
    public interface IRestaurantService
    {
        Task<IEnumerable<RestaurantReadDto>> GetAllAsync();
        Task<RestaurantReadDto?> GetByIdAsync(int id);
        Task<RestaurantReadDto> CreateAsync(RestaurantCreateDto dto, int userId);
        Task<bool> UpdateAsync(int id, RestaurantCreateDto dto, int userId);
        Task<bool> DeleteAsync(int id, int userId);
        Task<IEnumerable<RestaurantReadDto>> GetRestaurantsByUserIdAsync(int userId);
    }
}
