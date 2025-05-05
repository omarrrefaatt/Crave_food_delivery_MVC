using Crave.API.DTOS.Reviews;

namespace Crave.API.services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewReadDto> CreateAsync(ReviewCreateDto dto,int userId);
        Task<IEnumerable<ReviewReadDto>> GetByRestaurantIdAsync(int restaurantId,int managerId);
    }
}