using System.Security.Cryptography;
using System.Text;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.Reviews;
using Microsoft.EntityFrameworkCore;
using Crave.API.services.Interfaces;
using Crave.API.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace Crave.API.Services.Implementation
{
    public class ReviewService : IReviewService
    {
        private readonly CraveDbContext _context;
        private readonly ILogger<CardService> _logger;

        public ReviewService(CraveDbContext context, ILogger<CardService> logger)
        {
            _context = context;
            _logger = logger;
        }
        public async Task<ReviewReadDto> CreateAsync(ReviewCreateDto dto,int userId)
        {
            // Validate the input
            if (dto.Rating < 1 || dto.Rating > 5)
            {
                throw new ArgumentException("Rating must be between 1 and 5.");
            }

            // Check if the restaurant exists
            var restaurant = await _context.Restaurants
                    .Include(r => r.Reviews)
                    .FirstOrDefaultAsync(r => r.Id == dto.RestaurantId);

            if (restaurant == null)
            {
                throw new ArgumentException("Restaurant not found.");
            }
            if (restaurant.managerId == userId)
            {
                throw new ArgumentException("You cannot review your own restaurant.");
            }
            if (restaurant.Reviews == null)
            {
                restaurant.Reviews = new List<Review>();
                restaurant.Rating = dto.Rating;

            }
            else
            {
                restaurant.Rating = (restaurant.Rating * restaurant.Reviews.Count + dto.Rating) / (restaurant.Reviews.Count + 1);
            }
            var review = new Review
            {
                RestaurantId = dto.RestaurantId,
                UserId = userId,
                Rating = dto.Rating,
                Comments = dto.Comment,
                CreatedAt = DateTime.UtcNow
            };
            restaurant.Reviews.Append(review);
            Console.WriteLine("restaurant.Reviews: " + restaurant.Reviews.Count);


            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();

            return new ReviewReadDto
            {
                Id = review.Id,
                RestaurantId = review.RestaurantId,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comments,
                CreatedAt = review.CreatedAt,
            };
        
        }
        public async Task<IEnumerable<ReviewReadDto>> GetByRestaurantIdAsync(int restaurantId,int managerId)
        {
            // Check if the restaurant exists
            var restaurant = await _context.Restaurants.FindAsync(restaurantId);
            if (restaurant == null)
            {
                throw new ArgumentException("Restaurant not found.");
            }
            if (restaurant.managerId != managerId)
            {
                throw new ArgumentException("You are not authorized to view reviews for this restaurant.");
            }

            // Get reviews for the restaurant
        {
            var reviews = await _context.Reviews
                .Where(r => r.RestaurantId == restaurantId)
                .ToListAsync();

            return reviews.Select(r => new ReviewReadDto
            {
                Id = r.Id,
                RestaurantId = r.RestaurantId,
                UserId = r.UserId,
                Rating = r.Rating,
                Comment = r.Comments,
                CreatedAt = r.CreatedAt
            });
        }
    }
    }}