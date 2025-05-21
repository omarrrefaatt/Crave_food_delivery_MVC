using Crave.API.DTOS;
using Crave.API.Data.Entities;

namespace Crave.API.services
{
    public interface IOrderService
    {
        Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request);
        Task<OrderResponse> GetOrderByIdAsync(int id);
        Task<List<OrderResponse>> GetOrdersByUserIdAsync(int userId);
        Task<List<OrderResponse>> GetOrdersByRestaurantIdAsync(int restaurantId);
        Task<OrderResponse> UpdateOrderAsync(int id, UpdateOrderRequest request);
        Task<OrderResponse> UpdateOrderStatusAsync(int id, UpdateOrderStatusRequest request);
        Task<List<OrderDetailsResponse>> GetOrdersDetailsByUserIdAsync(int userId,string userRole);
        Task<bool> DeleteOrderAsync(int id,int userId);
    }
}
