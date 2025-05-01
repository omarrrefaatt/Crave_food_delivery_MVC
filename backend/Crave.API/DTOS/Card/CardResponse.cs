namespace Crave.API.DTOS.Card
{
    /// <summary>
    /// Response model for card information
    /// </summary>
    public class CardResponse
    {
        /// <summary>
        /// Card's unique identifier
        /// </summary>
        public int CardId { get; set; }
        
        /// <summary>
        /// Masked card number (shows only last 4 digits)
        /// </summary>
        public string MaskedCardNumber { get; set; } = string.Empty;
        
        /// <summary>
        /// Name of the cardholder
        /// </summary>
        public string CardHolderName { get; set; } = string.Empty;
        
        /// <summary>
        /// Card expiration date in MM/YYYY format
        /// </summary>
        public string ExpirationDate { get; set; } = string.Empty;
    }
}