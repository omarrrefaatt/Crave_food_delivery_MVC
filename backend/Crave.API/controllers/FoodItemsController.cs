using System.Security.Claims;
using Crave.API.DTOS.FoodItem;
using Crave.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration.UserSecrets;

namespace Crave.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FoodItemsController : ControllerBase
    {
        private readonly IFoodItemService _foodItemService;
        private readonly ILogger<FoodItemsController> _logger;

        public FoodItemsController(IFoodItemService foodItemService, ILogger<FoodItemsController> logger)
        {
            _foodItemService = foodItemService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all food items
        /// </summary>
        /// <returns>List of food items</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<IEnumerable<FoodItemResponse>>> GetAllFoodItems()

        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            var userRole =  User.FindFirst(ClaimTypes.Role)?.Value;
            if(userRole != "RestaurantOwner")
                return BadRequest("User is not authorized to view all food items.");
            try
            {
                var foodItems = await _foodItemService.GetAllFoodItemsAsync(int.Parse(userId));
                return Ok(foodItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving food items");
                return StatusCode(500, "An error occurred while retrieving food items");
            }
        }

        /// <summary>
        /// Retrieves food items by restaurant ID
        /// </summary>
        /// <param name="restaurantId">Restaurant ID</param>
        /// <returns>List of food items for the specified restaurant</returns>
        [HttpGet("by-restaurant/{restaurantId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<FoodItemResponse>>> GetFoodItemsByRestaurant(int restaurantId)
        {
            try
            {
                var foodItems = await _foodItemService.GetFoodItemsByRestaurantAsync(restaurantId);
                return Ok(foodItems);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving food items for restaurant {RestaurantId}", restaurantId);
                return StatusCode(500, "An error occurred while retrieving food items");
            }
        }

        /// <summary>
        /// Gets a food item by ID
        /// </summary>
        /// <param name="id">Food item ID</param>
        /// <returns>Food item details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<FoodItemResponse>> GetFoodItemById(int id)
        {
            try
            {
                var foodItem = await _foodItemService.GetFoodItemByIdAsync(id);
                if (foodItem == null)
                {
                    _logger.LogWarning("Food item with ID {FoodItemId} not found", id);
                    return NotFound($"Food item with ID {id} not found");
                }

                return Ok(foodItem);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving food item {FoodItemId}", id);
                return StatusCode(500, "An error occurred while retrieving the food item");
            }
        }

        /// <summary>
        /// Creates a new food item
        /// </summary>
        /// <param name="request">Food item creation data</param>
        /// <returns>Created food item information</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<ActionResult<FoodItemResponse>> CreateFoodItem([FromBody] CreateFoodItemRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            var userRole =  User.FindFirst(ClaimTypes.Role)?.Value;
            if(userRole != "RestaurantOwner")
                return BadRequest("User is not authorized to create a food item.");
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var foodItem = await _foodItemService.CreateFoodItemAsync(request,int.Parse(userId));
                return CreatedAtAction(nameof(GetFoodItemById), new { id = foodItem.Id }, foodItem);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Conflict creating food item");
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating food item");
                return StatusCode(500, "An error occurred while creating the food item");
            }
        }

        /// <summary>
        /// Updates a food item
        /// </summary>
        /// <param name="id">Food item ID</param>
        /// <param name="request">Food item update data</param>
        /// <returns>Updated food item information</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<FoodItemResponse>> UpdateFoodItem(int id, [FromBody] UpdateFoodItemRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedFoodItem = await _foodItemService.UpdateFoodItemAsync(id, request);
                if (updatedFoodItem == null)
                {
                    _logger.LogWarning("Food item with ID {FoodItemId} not found for update", id);
                    return NotFound($"Food item with ID {id} not found");
                }

                return Ok(updatedFoodItem);
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Conflict updating food item {FoodItemId}", id);
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating food item {FoodItemId}", id);
                return StatusCode(500, "An error occurred while updating the food item");
            }
        }

        /// <summary>
        /// Deletes a food item
        /// </summary>
        /// <param name="id">Food item ID</param>
        /// <returns>No content if successful</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteFoodItem(int id)
        {
            try
            {
                var result = await _foodItemService.DeleteFoodItemAsync(id);
                if (!result)
                {
                    _logger.LogWarning("Food item with ID {FoodItemId} not found for deletion", id);
                    return NotFound($"Food item with ID {id} not found");
                }

                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Conflict deleting food item {FoodItemId}", id);
                return Conflict(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting food item {FoodItemId}", id);
                return StatusCode(500, "An error occurred while deleting the food item");
            }
        }
    }
} 