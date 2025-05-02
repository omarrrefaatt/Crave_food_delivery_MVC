using Crave.API.Dtos;

namespace Crave.API.services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewReadDto> CreateAsync(ReviewCreateDto dto);
        Task<IEnumerable<ReviewReadDto>> GetByRestaurantIdAsync(int restaurantId);
    }
}
