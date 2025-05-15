using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crave.API.Data.Entities
{
    public class FoodItem
    {
        [Key]
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public double Rating { get; set; }

        public double Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;

        public int RestaurantId { get; set; }
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }

        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}


