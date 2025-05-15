using System.ComponentModel.DataAnnotations;

namespace Crave.API.DTOS.Card
{
    /// <summary>
    /// Request model for updating an existing payment card
    /// </summary>
    public class UpdateCardRequest
    {
        /// <summary>
        /// Card number (16 digits)
        /// </summary>
        [RegularExpression(@"^\d{16}$", ErrorMessage = "Card number must be 16 digits")]
        public string? CardNumber { get; set; }
        
        /// <summary>
        /// Card security code (3-4 digits)
        /// </summary>
        [RegularExpression(@"^\d{3,4}$", ErrorMessage = "CVV must be 3 or 4 digits")]
        public string? CVV { get; set; }
        
        /// <summary>
        /// Name of the cardholder as it appears on the card
        /// </summary>
        [StringLength(100, ErrorMessage = "Cardholder name cannot be longer than 100 characters")]
        public string? CardHolderName { get; set; }
        
        /// <summary>
        /// Expiration month (1-12)
        /// </summary>
        [Range(1, 12, ErrorMessage = "Expiration month must be between 1 and 12")]
        public int? ExpirationMonth { get; set; }
        
        /// <summary>
        /// Expiration year (4 digits)
        /// </summary>
        [Range(2023, 2050, ErrorMessage = "Expiration year must be valid")]
        public int? ExpirationYear { get; set; }
    }
}