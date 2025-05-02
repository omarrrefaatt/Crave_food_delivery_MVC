using Crave.API.DTOS.Card;
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
        private readonly ILogger<CardsController> _logger;

        public CardsController(ICardService cardService, ILogger<CardsController> logger)
        {
            _cardService = cardService;
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
        /// <param name="userId">Optional user ID to associate with the card</param>
        /// <returns>Created card information</returns>
        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<CardResponse>> CreateCard([FromBody] CreateCardRequest request, [FromQuery] int userId = 0)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var card = await _cardService.CreateCardAsync(request, userId);
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
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteCard(int id)
        {
            try
            {
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