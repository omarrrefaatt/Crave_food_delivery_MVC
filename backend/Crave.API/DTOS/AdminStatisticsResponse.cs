namespace Crave.API.DTOS
{
    public class AdminStatisticsResponse
    {
        public int TotalUsers { get; set; }
        public int TotalClients { get; set; }
        public int TotalManagers { get; set; }
        public int TotalAdmins { get; set; }
        public Dictionary<string, int> CategoriesNumberOfRestaurts { get; set; } = new Dictionary<string, int>();
        public int TotalRestaurants { get; set; }
        public int TotalOrders { get; set; }
        public decimal AverageOrderValue { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalFoodItems { get; set; }
        public int TotalReviews { get; set; }
    }
}