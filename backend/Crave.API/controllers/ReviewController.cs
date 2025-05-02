using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.Dtos;
using Crave.API.services.Interfaces;

namespace Crave.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewController : ControllerBase
    {
        private readonly CraveDbContext _context;
        private readonly IReviewService _reviewService;

        public ReviewController(CraveDbContext context, IReviewService reviewService)
        {
            _context = context;
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
        {
            var fakeUserId = 1; // لازم اليوزر ده يكون موجود فعلًا في جدول Users

            // تحقق هل اليوزر موجود بالفعل:
            var userExists = await _context.Users.AnyAsync(u => u.UserId == fakeUserId);
            if (!userExists)
                return BadRequest("Fake user not found in the database.");

            var review = new Review
            {
                Rating = dto.Rating,
                Comments = dto.Comment,
                RestaurantId = dto.RestaurantId,
                UserId = fakeUserId
            };

            _context.Reviews.Add(review);
            await _context.SaveChangesAsync();

            return Ok("Review added successfully.");
        }

        [HttpGet("restaurant/{restaurantId}")]
        public async Task<IActionResult> GetReviewsForRestaurant(int restaurantId)
        {
            var reviews = await _reviewService.GetByRestaurantIdAsync(restaurantId);
            return Ok(reviews);
        }
    }
}
