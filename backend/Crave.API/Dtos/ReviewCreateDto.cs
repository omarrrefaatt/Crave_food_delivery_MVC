namespace Crave.API.Dtos
{
    public class ReviewCreateDto
    {
        public float Rating { get; set; }
        public string Comment { get; set; }
        public int RestaurantId { get; set; }

    }
}
