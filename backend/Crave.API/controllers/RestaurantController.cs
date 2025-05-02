using AutoMapper;
using Crave.API.Dtos;
using Crave.API.services.Interfaces;
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
        public async Task<ActionResult<RestaurantReadDto>> Create(RestaurantCreateDto dto)
        {
            // هنا بنفترض userId ثابت (مثلاً 1) لأنك لغيت Authorize
            var userId = 1;

            var created = await _restaurantService.CreateAsync(dto, userId);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT: api/restaurant/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, RestaurantCreateDto dto)
        {
            var userId = 1;

            var updated = await _restaurantService.UpdateAsync(id, dto, userId);
            if (!updated)
                return NotFound();

            return NoContent();
        }

        // DELETE: api/restaurant/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var userId = 1;

            var deleted = await _restaurantService.DeleteAsync(id, userId);
            if (!deleted)
                return NotFound();

            return NoContent();
        }
    }
}
