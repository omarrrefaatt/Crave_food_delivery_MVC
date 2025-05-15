using System.Security.Cryptography;
using System.Text;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Crave.API.DTOS.Card;
using Microsoft.EntityFrameworkCore;
using Crave.API.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace Crave.API.Services.Implementation
{
    public class CardService : ICardService
    {
        private readonly CraveDbContext _context;
        private readonly ILogger<CardService> _logger;

        public CardService(CraveDbContext context, ILogger<CardService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<CardResponse>> GetAllCardsAsync()
        {
            var cards = await _context.Cards.ToListAsync();
            return cards.Select(MapCardToResponse);
        }

        public async Task<CardResponse?> GetCardByIdAsync(int cardId)
        {
            var card = await _context.Cards.FindAsync(cardId);
            return card != null ? MapCardToResponse(card) : null;
        }

        public async Task<IEnumerable<CardResponse>> GetCardsByUserIdAsync(int userId)
        {
            var cards = await _context.Users
                .Where(u => u.UserId == userId && u.CardId.HasValue)
                .Select(u => u.Card)
                .Where(c => c != null)
                .ToListAsync();

            return cards.Select(c => MapCardToResponse(c!));
        }

        public async Task<CardResponse> CreateCardAsync(CreateCardRequest request, int userId)
        {
            try
            {
                // Create the new card
                var card = new Card
                {
                    CardNumber = EncryptCardNumber(request.CardNumber),
                    CVV = EncryptCVV(request.CVV),
                    CardHolderName = request.CardHolderName
                    // Note: ExpirationMonth and ExpirationYear might need to be added to your Card entity
                };

                _context.Cards.Add(card);
                await _context.SaveChangesAsync();

                // Assign the card to the user if userId is provided
                if (userId > 0)
                {
                    var user = await _context.Users.FindAsync(userId);
                    if (user != null)
                    {
                        user.CardId = card.CardId;
                        await _context.SaveChangesAsync();
                    }
                }

                _logger.LogInformation("Card created successfully for user: {UserId}", userId);
                return MapCardToResponse(card);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating card: {Message}", ex.Message);
                throw new InvalidOperationException($"Could not create card. Please try again later.");
            }
        }

        public async Task<CardResponse?> UpdateCardAsync(int cardId, UpdateCardRequest request)
        {
            try
            {
                var card = await _context.Cards.FindAsync(cardId);
                if (card == null) return null;

                // Update only provided fields
                if (!string.IsNullOrWhiteSpace(request.CardNumber))
                    card.CardNumber = EncryptCardNumber(request.CardNumber);

                if (!string.IsNullOrWhiteSpace(request.CVV))
                    card.CVV = EncryptCVV(request.CVV);

                if (!string.IsNullOrWhiteSpace(request.CardHolderName))
                    card.CardHolderName = request.CardHolderName;

                // Update expiration date if your Card entity has these fields
                // if (request.ExpirationMonth.HasValue)
                //     card.ExpirationMonth = request.ExpirationMonth.Value;
                // 
                // if (request.ExpirationYear.HasValue)
                //     card.ExpirationYear = request.ExpirationYear.Value;

                await _context.SaveChangesAsync();
                _logger.LogInformation("Card updated successfully: {CardId}", cardId);
                return MapCardToResponse(card);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating card {CardId}: {Message}", cardId, ex.Message);
                throw new InvalidOperationException("Could not update card. Please try again later.");
            }
        }

        public async Task<bool> DeleteCardAsync(int cardId)
        {
            try
            {
                var card = await _context.Cards.FindAsync(cardId);
                if (card == null) return false;

                // Update users that use this card to remove the reference
                var users = await _context.Users.Where(u => u.CardId == cardId).ToListAsync();
                foreach (var user in users)
                {
                    user.CardId = null;
                }

                _context.Cards.Remove(card);
                await _context.SaveChangesAsync();
                _logger.LogInformation("Card deleted successfully: {CardId}", cardId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting card {CardId}: {Message}", cardId, ex.Message);
                throw new InvalidOperationException("Could not delete card. Please try again later.");
            }
        }

        public async Task<bool> AssignCardToUserAsync(int cardId, int userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                var card = await _context.Cards.FindAsync(cardId);

                if (user == null || card == null)
                    return false;

                user.CardId = cardId;
                await _context.SaveChangesAsync();
                _logger.LogInformation("Card {CardId} assigned to user {UserId}", cardId, userId);
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning card {CardId} to user {UserId}: {Message}", cardId, userId, ex.Message);
                throw new InvalidOperationException("Could not assign card to user. Please try again later.");
            }
        }

        private static CardResponse MapCardToResponse(Card card)
        {
            return new CardResponse
            {
                CardId = card.CardId,
                MaskedCardNumber = MaskCardNumber(DecryptCardNumber(card.CardNumber)),
                CardHolderName = card.CardHolderName
                // Add expiration date if your Card entity has these fields
                // ExpirationDate = $"{card.ExpirationMonth:D2}/{card.ExpirationYear}"
            };
        }

        // Security methods for sensitive card information
        private static string EncryptCardNumber(string cardNumber)
        {
            // In a production environment, use proper encryption
            // This is a simplified example for demonstration
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(cardNumber));
        }

        private static string DecryptCardNumber(string encryptedCardNumber)
        {
            // In a production environment, use proper decryption
            // This is a simplified example for demonstration
            return Encoding.UTF8.GetString(Convert.FromBase64String(encryptedCardNumber));
        }

        private static string EncryptCVV(string cvv)
        {
            // In a production environment, use proper encryption
            // This is a simplified example for demonstration
            return Convert.ToBase64String(Encoding.UTF8.GetBytes(cvv));
        }

        private static string MaskCardNumber(string cardNumber)
        {
            // Show only the last 4 digits
            if (cardNumber.Length > 4)
            {
                return "XXXX-XXXX-XXXX-" + cardNumber.Substring(cardNumber.Length - 4);
            }
            return cardNumber;
        }
    }
}