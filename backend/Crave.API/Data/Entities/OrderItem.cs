using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crave.API.Data.Entities
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }

        public int FoodItemId { get; set; }
        [ForeignKey("FoodItemId")]
        public FoodItem? FoodItem { get; set; }

        public int Quantity { get; set; }

        public int OrderId { get; set; }
        public Order? Order { get; set; }
    }
}
