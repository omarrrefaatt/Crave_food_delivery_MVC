namespace Crave.API.DTOS
{
    public class CreateOrderRequest
    {
        public int UserId { get; set; }
        public int RestaurantId { get; set; }
        public List<CreateOrderItemRequest> OrderItem { get; set; }
        public string Notes { get; set; }
        public string PaymentMethod { get; set; }
    }
    public class CreateOrderItemRequest
    {
        public int FoodItemId { get; set; }
        public int Quantity { get; set; }
    }

}
