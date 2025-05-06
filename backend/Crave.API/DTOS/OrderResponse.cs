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
    public class OrderItemResponse
    {
        public int Id { get; set; }
        public int FoodItemId { get; set; }
        public string FoodItemName { get; set; } = string.Empty;
        public int Quantity { get; set; }
    }
}
