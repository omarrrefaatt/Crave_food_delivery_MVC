namespace Crave.API.DTOS.Reviews
{
    public class ReviewReadDto
    {
        public int Id { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public int RestaurantId { get; set; }
        public int UserId { get; set; }
         
        public DateTime CreatedAt { get; set; }
    }
}