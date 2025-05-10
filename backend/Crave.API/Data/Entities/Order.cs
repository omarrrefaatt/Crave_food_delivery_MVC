using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Crave.API.Data.Entities
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        public string Notes { get; set; } = string.Empty;
        public double Rating { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;

        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }

        public int RestaurantId { get; set; }
        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }
        public string OrderStatus { get; set; } = "Pending";
        public decimal TotalPrice { get; set; }
        
        public ICollection<OrderItem>? OrderItems { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    }
}
