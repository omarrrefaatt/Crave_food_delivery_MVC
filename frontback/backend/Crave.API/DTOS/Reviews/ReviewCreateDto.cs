namespace Crave.API.DTOS.Reviews
{
    public class ReviewCreateDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }= string.Empty;
        public int RestaurantId { get; set; }
    }
}