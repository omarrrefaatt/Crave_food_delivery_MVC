namespace Crave.API.Dtos
{
    public class RestaurantCreateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public float Rating { get; set; }
        public int AvgDeliveryTime { get; set; }
        public string ContactInfo { get; set; }
        public string OperatingHours { get; set; }
        public string Location { get; set; }
    }
}
