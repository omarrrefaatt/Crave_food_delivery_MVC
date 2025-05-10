using System.ComponentModel.DataAnnotations;

namespace Crave.API.DTOS.FoodItem
{
    public class UpdateFoodItemRequest
    {
        [StringLength(100, ErrorMessage = "Name cannot exceed 100 characters")]
        public string? Name { get; set; }

        [StringLength(500, ErrorMessage = "Description cannot exceed 500 characters")]
        public string? Description { get; set; }

        [Range(0, 5, ErrorMessage = "Rating must be between 0 and 5")]
        public double? Rating { get; set; }

        public int? RestaurantId { get; set; }
        public string ImageUrl { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0")]
        public double? Price { get; set; }
    }
} 