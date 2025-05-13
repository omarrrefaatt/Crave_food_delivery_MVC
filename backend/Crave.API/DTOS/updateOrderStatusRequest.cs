namespace Crave.API.DTOS
{
    public class UpdateOrderStatusRequest
    {
        public int userId { get; set; }
        public string? OrderStatus { get; set; }
    }
}
