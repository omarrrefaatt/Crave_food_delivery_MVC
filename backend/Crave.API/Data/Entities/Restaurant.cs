using System.ComponentModel.DataAnnotations;

namespace Crave.API.Data.Entities
{
    public class Restaurant
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string AvgDeliveryTime { get; set; } = string.Empty;
        public string ContactInfo { get; set; } = string.Empty;
        public string OperatingHours { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;

        public int UserId { get; set; }

        // required لتفادي التحذير
        public required User User { get; set; }

        public ICollection<FoodItem>? FoodItems { get; set; }
        public ICollection<Order>? Orders { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
