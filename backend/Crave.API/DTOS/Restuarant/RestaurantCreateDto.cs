namespace Crave.API.DTOS.Restaurant
{
    public class RestaurantCreateDto
    {
        public int userId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public float Rating { get; set; }
        public int AvgDeliveryTime { get; set; }
        public string ContactInfo { get; set; } = string.Empty;
        public string OperatingHours { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
            public string ImageUrl { get; set; } = string.Empty;
        }
}