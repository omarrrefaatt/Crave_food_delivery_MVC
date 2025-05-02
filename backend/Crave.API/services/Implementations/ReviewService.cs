using AutoMapper;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.Dtos;
using Crave.API.services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Crave.API.services.Implementations
{
    public class ReviewService : IReviewService
    {
        private readonly CraveDbContext _context;
        private readonly IMapper _mapper;

        public ReviewService(CraveDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<ReviewReadDto> CreateAsync(ReviewCreateDto dto)
        {
            var review = _mapper.Map<Review>(dto);
            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();
            return _mapper.Map<ReviewReadDto>(review);
        }

        public async Task<IEnumerable<ReviewReadDto>> GetByRestaurantIdAsync(int restaurantId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.RestaurantId == restaurantId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<ReviewReadDto>>(reviews);
        }
    }
}
