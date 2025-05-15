using System.Security.Claims;
using Crave.API.DTOS.Restaurant;
using Crave.API.services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Crave.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantController : ControllerBase
    {
        private readonly IRestaurantService _restaurantService;

        public RestaurantController(IRestaurantService restaurantService)
        {
            _restaurantService = restaurantService;
        }

        // GET: api/restaurant
        [HttpGet]
        public async Task<ActionResult<IEnumerable<RestaurantReadDto>>> GetAll()
        {
            var restaurants = await _restaurantService.GetAllAsync();
            return Ok(restaurants);
        }

        // GET: api/restaurant/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<RestaurantReadDto>> GetById(int id)
        {
            var restaurant = await _restaurantService.GetByIdAsync(id);
            if (restaurant == null)
                return NotFound();

            return Ok(restaurant);
        }

        // POST: api/restaurant
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize] // Re-enabled authentication for normal endpoint
        public async Task<ActionResult<RestaurantReadDto>> Create(RestaurantCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole == null)
                return BadRequest("User is not authorized to create a restaurant.");
                
            // Allow both Admin and RestaurantOwner roles to create restaurants
            if(userRole != "RestaurantOwner" && userRole != "admin")
                return BadRequest("Only administrators and restaurant owners can create restaurants.");

            var created = await _restaurantService.CreateAsync(dto, int.Parse(userId));
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        
        // POST: api/restaurant/create-without-auth
        // Special endpoint for testing that bypasses authentication
        [HttpPost("create-without-auth")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        // No [Authorize] attribute - this endpoint is public
        public async Task<ActionResult<RestaurantReadDto>> CreateWithoutAuth(RestaurantCreateDto dto)
        {
            // Hardcoded admin user ID for testing
            int userId = 1;
            
            // Log the incoming data for debugging
            Console.WriteLine($"Received restaurant create request (no auth): {dto.Name}, {dto.Location}");
            
            try
            {
                // Create the restaurant with the hardcoded user ID
                var created = await _restaurantService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating restaurant: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        // PUT: api/restaurant/{id}
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<IActionResult> Update(int id, RestaurantCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            if (User.FindFirst(ClaimTypes.Role)?.Value != "RestaurantOwner")
                return BadRequest("User is not authorized to update a restaurant.");
            var restaurant = await _restaurantService.GetByIdAsync(id);
            if (restaurant == null)
                return NotFound();

            var updated = await _restaurantService.UpdateAsync(id, dto, int.Parse(userId));
            if (!updated)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/restaurant/{id}
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            if (User.FindFirst(ClaimTypes.Role)?.Value == "RestaurantOwner")
                return BadRequest("User is not authorized to delete a restaurant.");
            var restaurant = await _restaurantService.GetByIdAsync(id);
            if (restaurant == null)
                return NotFound();

            var deleted = await _restaurantService.DeleteAsync(id, int.Parse(userId));
            if (!deleted)
                return BadRequest("User is not authorized to delete this restaurant.") ;

            return NoContent();
        }
    }
}