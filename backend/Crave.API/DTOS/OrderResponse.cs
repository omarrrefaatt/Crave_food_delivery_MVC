namespace Crave.API.DTOS
{
    public class OrderResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public List<OrderItemResponse> OrderItem { get; set; } = [];
        public string Notes { get; set; }= string.Empty;
        public string PaymentMethod { get; set; }= string.Empty;

    }
    public class OrderDetailsResponse
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public string RestaurantImage { get; set; }
        public string RestaurantName { get; set; } = string.Empty;
        
        public List<OrderItemResponse> OrderItem { get; set; } = [];
        public string OrderStatus { get; set; } = string.Empty;
        public DateTime OrderDate { get; set; }
        public decimal TotalPrice { get; set; }
        public string Notes { get; set; }= string.Empty;
        public string PaymentMethod { get; set; }= string.Empty;
    }

    public class OrderItemResponse
    {
        public int Id { get; set; }
        public int FoodItemId { get; set; }
        public string FoodItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public double price { get; set; } = 0;
        
    }
}
