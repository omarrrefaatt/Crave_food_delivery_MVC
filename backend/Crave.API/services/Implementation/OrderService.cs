using Crave.API.DTOS;
using Crave.API.Data;
using Crave.API.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Crave.API.services
{
    public class OrderService : IOrderService
    {
        private readonly CraveDbContext _context;

        public OrderService(CraveDbContext context)
        {
            _context = context;
        }

        public async Task<OrderResponse> CreateOrderAsync(CreateOrderRequest request)
        {
            foreach (var item in request.OrderItem)
            {
                var foodItem = await _context.FoodItems.FindAsync(item.FoodItemId);
                if (foodItem == null)
                    throw new KeyNotFoundException($"Food item with ID {item.FoodItemId} not found");
                if (foodItem.RestaurantId != request.RestaurantId)
                    throw new InvalidOperationException($"Food item with ID {item.FoodItemId} does not belong to restaurant with ID {request.RestaurantId}");
                if (item.Quantity <= 0)
                    throw new ArgumentException($"Quantity for food item with ID {item.FoodItemId} must be greater than zero");
            }

            var restaurant = await _context.Restaurants.FindAsync(request.RestaurantId);
            if (restaurant == null)
                throw new KeyNotFoundException($"Restaurant with ID {request.RestaurantId} not found");

            var order = new Order
            {
                UserId = request.UserId,
                RestaurantId = request.RestaurantId,
                Notes = request.Notes,
                PaymentMethod = request.PaymentMethod,
                OrderStatus = "Pending",
                TotalPrice = request.OrderItem.Sum(item => item.Quantity * (decimal)_context.FoodItems.Find(item.FoodItemId).Price),
                CreatedAt = DateTime.UtcNow,
                OrderItems = request.OrderItem.Select(item => new OrderItem
                {  FoodItemId = item.FoodItemId,
                    Quantity = item.Quantity
                }).ToList()
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return await GetOrderByIdAsync(order.Id);
        }

        public async Task<OrderResponse> GetOrderByIdAsync(int id)
        {
            
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                throw new KeyNotFoundException($"Order with ID {id} not found");

            return MapToOrderResponse(order);
        }

        public async Task<List<OrderResponse>> GetOrdersByUserIdAsync(int userId)
        {
            var orders = new List<Order>();
            if (userId <= 0) {
                orders = await _context.Orders.Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .ToListAsync();
            } 
            else
            {
                orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .Where(o => o.UserId == userId)
                .ToListAsync();
            }
            return orders.Select(MapToOrderResponse).ToList();
        }
        public async Task<List<OrderDetailsResponse>> GetOrdersDetailsByUserIdAsync(int userId,string userRole)
        {
            if (userRole != "customer" && userRole != "restaurant")
                throw new InvalidOperationException($"User with ID {userId} does not have permission to view orders");

            if (userId <= 0)
                throw new ArgumentException("User ID must be greater than zero");
            var orders = new List<Order>();
            if (userRole == "restaurant")
            {
                orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .Include(o => o.Restaurant)
                .Where(o => o.Restaurant.managerId == userId)
                .ToListAsync();

            }
            else
            {
                orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .Include(o => o.Restaurant)
                .Where(o => o.UserId == userId)
                .ToListAsync();
                
            }
             
            return orders.Select(MapToOrderDetailsResponse).ToList();
        }

        public async Task<List<OrderResponse>> GetOrdersByRestaurantIdAsync(int restaurantId)
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .Where(o => o.RestaurantId == restaurantId)
                .ToListAsync();

            return orders.Select(MapToOrderResponse).ToList();
        }

        public async Task<OrderResponse> UpdateOrderAsync(int id, UpdateOrderRequest request)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null)
                throw new KeyNotFoundException($"Order with ID {id} not found");

            if (request.Notes != null)
                order.Notes = request.Notes;

            if (request.PaymentMethod != null)
                order.PaymentMethod = request.PaymentMethod;

            await _context.SaveChangesAsync();
            return MapToOrderResponse(order);
        }
        public async Task<OrderResponse> UpdateOrderStatusAsync(int id, UpdateOrderStatusRequest request)
        {
            var order = await _context.Orders.Include(o=>o.Restaurant).FirstOrDefaultAsync(o => o.Id == id);


            if (order == null)
                throw new KeyNotFoundException($"Order with ID {id} not found");
            // if (order.UserId != request.userId && order.Restaurant?.managerId != request.userId)
            //     throw new InvalidOperationException($"Order with ID {id} does not belong to user with ID {request.userId}");

            if(request.OrderStatus != null)
                order.OrderStatus = request.OrderStatus;
            else
                throw new ArgumentException("Order status cannot be null");

            await _context.SaveChangesAsync();
            return MapToOrderResponse(order);
        }

        public async Task<bool> DeleteOrderAsync(int id,int userId)
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.FoodItem)
                .FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);

            if (order == null)
                return false;
            if (order.OrderItems == null)
                return false;
            if (order.OrderItems.Count == 0)
                return false;
            if(order.UserId != userId)
                return false;

            foreach (var item in order.OrderItems)
            {
                _context.OrderItems.Remove(item);
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return true;
        }
        

        private OrderResponse MapToOrderResponse(Order order)
        {
            return new OrderResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                RestaurantId = order.RestaurantId,
                Notes = order.Notes,
                PaymentMethod = order.PaymentMethod,
                OrderItem = order.OrderItems?.Select(item => new OrderItemResponse
                {
                    Id = item.Id,
                    FoodItemId = item.FoodItemId,
                    FoodItemName = item.FoodItem?.Name ?? "Unknown Item",
                    Quantity = item.Quantity,
                    price = item.FoodItem?.Price ?? 0
                }).ToList() ?? new List<OrderItemResponse>()
            };
        }
        private OrderDetailsResponse MapToOrderDetailsResponse(Order order)
        {
            return new OrderDetailsResponse
            {
                Id = order.Id,
                UserId = order.UserId,
                RestaurantId = order.RestaurantId,
                RestaurantImage = order.Restaurant?.ImageUrl ?? "Unknown Image",
                RestaurantName = order.Restaurant?.Name ?? "Unknown Restaurant",
                Notes = order.Notes,
                PaymentMethod = order.PaymentMethod,
                OrderStatus = order.OrderStatus,
                OrderDate = order.CreatedAt,
                TotalPrice = order.TotalPrice,
                OrderItem = order.OrderItems?.Select(item => new OrderItemResponse
                {
                    Id = item.Id,
                    FoodItemId = item.FoodItemId,
                    FoodItemName = item.FoodItem?.Name ?? "Unknown Item",
                    Quantity = item.Quantity,
                    price = item.FoodItem?.Price ?? 0
                }).ToList() ?? new List<OrderItemResponse>()
            };
        }
    }
} 