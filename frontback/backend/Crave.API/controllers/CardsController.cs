using System.Security.Claims;
using Crave.API.DTOS.Card;
using Crave.API.Services.Implementation;

using Crave.API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Crave.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CardsController : ControllerBase
    {
        private readonly ICardService _cardService;

        private readonly IUserService _userService;
        private readonly ILogger<CardsController> _logger;

        public CardsController(ICardService cardService,IUserService userService, ILogger<CardsController> logger)
        {
            _cardService = cardService;
            _userService = userService;
            _logger = logger;
        }

        /// <summary>
        /// Retrieves all cards
        /// </summary>
        /// <returns>List of cards</returns>
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]
        public async Task<ActionResult<IEnumerable<CardResponse>>> GetAllCards()
        {
            try
            {
                var cards = await _cardService.GetAllCardsAsync();
                return Ok(cards);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cards");
                return StatusCode(500, "An error occurred while retrieving cards");
            }
        }

        /// <summary>
        /// Gets a card by ID
        /// </summary>
        /// <param name="id">Card ID</param>
        /// <returns>Card details</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CardResponse>> GetCardById(int id)
        {
            try
            {
                var card = await _cardService.GetCardByIdAsync(id);
                if (card == null)
                {
                    _logger.LogWarning("Card with ID {CardId} not found", id);
                    return NotFound($"Card with ID {id} not found");
                }

                return Ok(card);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving card {CardId}", id);
                return StatusCode(500, "An error occurred while retrieving the card");
            }
        }

        /// <summary>
        /// Gets cards by user ID
        /// </summary>
        /// <param name="userId">User ID</param>
        /// <returns>List of cards associated with the user</returns>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<IEnumerable<CardResponse>>> GetCardsByUserId(int userId)
        {
            try
            {
                var cards = await _cardService.GetCardsByUserIdAsync(userId);
                return Ok(cards);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving cards for user {UserId}", userId);
                return StatusCode(500, "An error occurred while retrieving the cards");
            }
        }

        /// <summary>
        /// Creates a new card
        /// </summary>
        /// <param name="request">Card creation data</param>
        /// <returns>Created card information</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]

        [Authorize]
        public async Task<ActionResult<CardResponse>> CreateCard([FromBody] CreateCardRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if(string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User ID is required");
                }
                if (!int.TryParse(userId, out int parsedUserId))
                {
                    return BadRequest("Invalid User ID");
                }
                

                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }


                var card = await _cardService.CreateCardAsync(request, int.Parse(userId));

                return CreatedAtAction(nameof(GetCardById), new { id = card.CardId }, card);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating card");
                return StatusCode(500, "An error occurred while creating the card");
            }
        }

        /// <summary>
        /// Updates a card
        /// </summary>
        /// <param name="id">Card ID</param>
        /// <param name="request">Card update data</param>
        /// <returns>Updated card information</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CardResponse>> UpdateCard(int id, [FromBody] UpdateCardRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var updatedCard = await _cardService.UpdateCardAsync(id, request);
                if (updatedCard == null)
                {
                    _logger.LogWarning("Card with ID {CardId} not found for update", id);
                    return NotFound($"Card with ID {id} not found");
                }

                return Ok(updatedCard);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating card {CardId}", id);
                return StatusCode(500, "An error occurred while updating the card");
            }
        }

        /// <summary>
        /// Deletes a card
        /// </summary>
        /// <param name="id">Card ID</param>
        /// <returns>No content on success</returns>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [Authorize]

        public async Task<IActionResult> DeleteCard(int id)
        {
            try
            {

                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                {
                    return BadRequest("User ID is required");
                }
                
                var user = await _userService.GetUserByIdAsync(int.Parse(userId));

                if (user == null)
                {
                    _logger.LogWarning("User with ID {UserId} not found", userId);
                    return NotFound($"User with ID {userId} not found");
                }
                Console.WriteLine($"User ID: {userId}, Card ID: {id}");
            
                if (user.CardId != id){
                    _logger.LogWarning("User {UserId} attempted to delete card {CardId} which they don't own", userId, id);
                    return Forbid("You are not authorized to delete this card");
                }

                var result = await _cardService.DeleteCardAsync(id);
                if (!result)
                {
                    _logger.LogWarning("Card with ID {CardId} not found for deletion", id);
                    return NotFound($"Card with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting card {CardId}", id);
                return StatusCode(500, "An error occurred while deleting the card");
            }
        }

        /// <summary>
        /// Assigns a card to a user
        /// </summary>
        /// <param name="cardId">Card ID</param>
        /// <param name="userId">User ID</param>
        /// <returns>Success message</returns>
        [HttpPost("{cardId}/assign/{userId}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> AssignCardToUser(int cardId, int userId)
        {
            try
            {
                var result = await _cardService.AssignCardToUserAsync(cardId, userId);
                if (!result)
                {
                    return NotFound("Card or user not found");
                }

                return Ok(new { message = $"Card {cardId} successfully assigned to user {userId}" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning card {CardId} to user {UserId}", cardId, userId);
                return StatusCode(500, "An error occurred while assigning the card");
            }
        }
    }
}