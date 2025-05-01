namespace Crave.API.DTOS.User
{
    /// <summary>
    /// Response model for user data
    /// </summary>
    public class UserResponse
    {
        /// <summary>
        /// User's unique identifier
        /// </summary>
        public int UserId { get; set; }
        
        /// <summary>
        /// User's full name
        /// </summary>
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// User's email address
        /// </summary>
        public string Email { get; set; } = string.Empty;
        
        /// <summary>
        /// User's role (e.g., Customer, Admin)
        /// </summary>
        public string Role { get; set; } = string.Empty;
        
        /// <summary>
        /// User's phone number
        /// </summary>
        public string Phone { get; set; } = string.Empty;
        
        /// <summary>
        /// User's address
        /// </summary>
        public string Address { get; set; } = string.Empty;
        
        /// <summary>
        /// User's zip/postal code
        /// </summary>
        public string ZipCode { get; set; } = string.Empty;

        /// <summary>
        /// User's card ID
        /// </summary>
        public int? CardId { get; set; }
        
        /// <summary>
        /// JWT authentication token
        /// </summary>
        public string Token { get; set; } = string.Empty;
    }
}