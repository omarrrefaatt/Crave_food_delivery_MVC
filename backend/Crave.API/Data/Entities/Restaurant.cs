using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crave.API.Data.Entities
{
    public class Restaurant
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public float Rating { get; set; }
        public int AvgDeliveryTime { get; set; } = 0;
        public string ContactInfo { get; set; } = string.Empty;
        public string OperatingHours { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public int managerId { get; set; }
        [ForeignKey("UserId")]
        public ICollection<FoodItem>? FoodItems { get; set; }
        public ICollection<Order>? Orders { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
