using System.ComponentModel.DataAnnotations;

namespace Crave.API.DTOS.User
{
    /// <summary>
    /// Request model for creating a new user
    /// </summary>
    public class CreateUserRequest
    {
        /// <summary>
        /// User's full name
        /// </summary>
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name cannot be longer than 100 characters")]
        public string Name { get; set; } = string.Empty;
        
        /// <summary>
        /// User's email address (must be unique)
        /// </summary>
        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid email format")]
        [StringLength(150, ErrorMessage = "Email cannot be longer than 150 characters")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// User's password
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// User's password
        /// </summary>
        [Required(ErrorMessage = "Password is required")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters")]
        public string confirmPassword { get; set; } = string.Empty;

        
        /// <summary>
        /// User's role (e.g., Customer, Admin)
        /// </summary>
        [StringLength(50, ErrorMessage = "Role cannot be longer than 50 characters")]
        public string Role { get; set; } = "Customer"; // Default role
        
        /// <summary>
        /// User's phone number
        /// </summary>
        [Phone(ErrorMessage = "Invalid phone number format")]
        [StringLength(20, ErrorMessage = "Phone number cannot be longer than 20 characters")]
        public string Phone { get; set; } = string.Empty;
        
        /// <summary>
        /// User's address
        /// </summary>
        [StringLength(200, ErrorMessage = "Address cannot be longer than 200 characters")]
        public string Address { get; set; } = string.Empty;
        
        /// <summary>
        /// User's zip/postal code
        /// </summary>
        [StringLength(20, ErrorMessage = "Zip code cannot be longer than 20 characters")]
        public string ZipCode { get; set; } = string.Empty;
        
        /// <summary>
        /// ID of the payment card associated with this user (optional)
        /// </summary>
        public int? CardId { get; set; }
    }
}