using Crave.API.DTOS.FoodItem;
using Crave.API.DTOS.Reviews;

namespace Crave.API.DTOS.Restaurant
{
    public class RestaurantDetailsDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public float Rating { get; set; }
        public string Location { get; set; }= string.Empty;
        public string Description { get; set; }= string.Empty;
        public string Category { get; set; }= string.Empty;
        public int AvgDeliveryTime { get; set; }

        public string ContactInfo { get; set; }= string.Empty;
        public string OperatingHours { get; set; }= string.Empty;
        public string ImageUrl { get; set; }= string.Empty;
        public double totalRevnue { get; set; }
        public int totalSucsessOrders { get; set; }
        public int totalOrders { get; set; }
        public int totalCancelledOrders { get; set; }
        
        public List<ReviewReadDto>? Reviews { get; set; }

    }
}