namespace Crave.API.DTOS.User
{
    /// <summary>
    /// Response model for user data
    /// </summary>
    public class AuthenticationResponse

    {        
        /// <summary>
        /// User's role (e.g., Customer, Admin)
        /// </summary>
        public string Role { get; set; } = string.Empty;
        /// <summary>
        /// token for authentication
        /// </summary>
        public string Token { get; set; } = string.Empty;
    }
}