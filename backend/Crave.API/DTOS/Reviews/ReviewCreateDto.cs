namespace Crave.API.DTOS.Reviews
{
    public class ReviewCreateDto
    {
        public int Rating { get; set; }
        public string Comment { get; set; }
        public int RestaurantId { get; set; }

        public string createdAt { get; set; }

    }
}