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
        [Authorize]
        public async Task<ActionResult<RestaurantReadDto>> Create(RestaurantCreateDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            var userRole =  User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == null)
                return BadRequest("User is not de2deded to create a restaurant.");
            if(userRole.ToString() != "RestaurantOwner" && userRole.ToString() != "admin" )
                return BadRequest("User is not authorededdedeized to create a restaurant.");
            if (userRole.ToString() == "RestaurantOwner")
            {
                dto.userId = int.Parse(userId);
            }

            var created = await _restaurantService.CreateAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
                // POST: api/restaurant
        [HttpGet("getMyRestaurant")]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<ActionResult<RestaurantDetailsDto>> getMyRestaurant()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            var userRole =  User.FindFirst(ClaimTypes.Role)?.Value;

            if (userRole == null)
                return BadRequest("User is not de2deded to create a restaurant.");
            if(userRole.ToString() != "RestaurantOwner"  )
                return BadRequest("User does not have a restaurant.");

            var response = await _restaurantService.GetRestaurantByUserIdAsync(int.Parse(userId));
            return response;
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
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole == null)
                return BadRequest("User is not authorized to update a restaurant.");
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            if (userRole.ToString() != "RestaurantOwner" && userRole.ToString() != "admin")
                return BadRequest("User is not authorized to delete ahhhhh restaurant.");
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
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userRole == null)
                return BadRequest("User is not authorized to delete a restaurant.");
            Console.WriteLine("userRole: " + userRole);
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            if (userRole.ToString() != "RestaurantOwner" && userRole.ToString() != "admin")
                return BadRequest("User is not authorized to delete ahhhhh restaurant.");
            
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