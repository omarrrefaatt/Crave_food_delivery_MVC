using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.Reviews;
using Crave.API.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims."); 
            var userExists = await _context.Users.AnyAsync(u => u.UserId == int.Parse(userId));
            if (!userExists)
                return BadRequest("user not found in the database.");


           var review = await _reviewService.CreateAsync(dto, int.Parse(userId));
            

            return CreatedAtAction(nameof(GetReviewsForRestaurant), new { restaurantId = review.RestaurantId }, review);
        }

        [HttpGet("restaurant/{restaurantId}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
    
        public async Task<IActionResult> GetReviewsForRestaurant(int restaurantId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            if (User.FindFirst(ClaimTypes.Role)?.Value != "RestaurantOwner")
                return BadRequest("User is not the owner of the restaurant.");
    
            var reviews = await _reviewService.GetByRestaurantIdAsync(restaurantId,int.Parse(userId));
            return Ok(reviews);
        }
    }
}