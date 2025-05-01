using Crave.API.DTOS.Card;

namespace Crave.API.Services.Interfaces
{
    public interface ICardService
    {
        Task<IEnumerable<CardResponse>> GetAllCardsAsync();
        Task<CardResponse?> GetCardByIdAsync(int cardId);
        Task<IEnumerable<CardResponse>> GetCardsByUserIdAsync(int userId);
        Task<CardResponse> CreateCardAsync(CreateCardRequest request, int userId);
        Task<CardResponse?> UpdateCardAsync(int cardId, UpdateCardRequest request);
        Task<bool> DeleteCardAsync(int cardId);
        Task<bool> AssignCardToUserAsync(int cardId, int userId);
    }
}