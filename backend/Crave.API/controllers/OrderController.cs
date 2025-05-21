using Microsoft.AspNetCore.Mvc;
using Crave.API.DTOS;
using Crave.API.services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace Crave.API.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        /// <summary>
        /// Creates a new order
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [Authorize]
        public async Task<ActionResult<OrderResponse>> CreateOrder(CreateOrderRequest request)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (userId == null)
                    return BadRequest("User ID not found in claims.");
                var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
                if (userRole == null)
                    return BadRequest("User is not authorized to create an order.");
                if (userRole.ToString() != "Customer")
                    return BadRequest("User is not authorized to create an order, only customers can create orders.");
                if (request.OrderItem == null || !request.OrderItem.Any())
                    return BadRequest("Order must contain at least one item.");
                request.UserId = int.Parse(userId);
                Console.WriteLine("waslttttttfegcfweuf");
                var order = await _orderService.CreateOrderAsync(request);
                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// Gets all orders 
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(List<OrderResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<List<OrderResponse>>> GetOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            if (userRole == null)
                return BadRequest("User is not authorized to get orders.");
            if (userRole.ToString() != "admin")
                return BadRequest("User is not authorized to get orders, only admins can get all orders.");
            try
                {

                    var orders = await _orderService.GetOrdersByUserIdAsync(0);
                    return Ok(orders);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
        }

        /// <summary>
        /// Gets an order by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderResponse>> GetOrder(int id)
        {
            try
            {
                var order = await _orderService.GetOrderByIdAsync(id);
                return Ok(order);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Gets all orders for a specific user
        /// </summary>
        [HttpGet("user/{userId}")]
        [ProducesResponseType(typeof(List<OrderResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<OrderResponse>>> GetOrdersByUser(int userId)
        {
            try
            {
                var orders = await _orderService.GetOrdersByUserIdAsync(userId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// Gets all orders for a specific user
        /// </summary>
        [HttpGet("user")]
        [ProducesResponseType(typeof(List<OrderResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<List<OrderDetailsResponse>>> GetMyOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            try
            {
                var orders = await _orderService.GetOrdersDetailsByUserIdAsync(int.Parse(userId),"customer");
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
                /// <summary>
        /// Gets all orders for a specific restaurant
        /// </summary>
        [HttpGet("restaurant")]
        [ProducesResponseType(typeof(List<OrderResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<List<OrderDetailsResponse>>> GetMyRestaurantOrders()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            try
            {
                var orders = await _orderService.GetOrdersDetailsByUserIdAsync(int.Parse(userId),"restaurant");
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Gets all orders for a specific restaurant
        /// </summary>
        [HttpGet("restaurant/{restaurantId}")]
        [ProducesResponseType(typeof(List<OrderResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<List<OrderResponse>>> GetOrdersByRestaurant(int restaurantId)
        {
            try
            {
                var orders = await _orderService.GetOrdersByRestaurantIdAsync(restaurantId);
                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Updates an existing order
        /// </summary>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrderResponse>> UpdateOrder(int id, UpdateOrderRequest request)
        {
            try
            {
                var order = await _orderService.UpdateOrderAsync(id, request);
                return Ok(order);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        /// <summary>
        /// Updates an existing order status
        /// </summary>
        [HttpPut("status/{id}")]
        [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult<OrderResponse>> UpdateOrderStatus(int id, UpdateOrderStatusRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;
            if (request.OrderStatus == null)
                return BadRequest("Order status cannot be null");
            if (request.OrderStatus != "Pending" && request.OrderStatus != "processing" && request.OrderStatus != "cancelled" && request.OrderStatus != "delivered")
                return BadRequest("Order status must be either 'Pending', 'processing', 'cancelled' or 'delivered'");

            try
            {
                var order = await _orderService.UpdateOrderStatusAsync(id, request);
                return Ok(order);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Deletes an order
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [Authorize]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
                return BadRequest("User ID not found in claims.");
            try
            {
                var result = await _orderService.DeleteOrderAsync(id,int.Parse(userId));
                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
} 