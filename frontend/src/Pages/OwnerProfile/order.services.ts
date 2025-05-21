/**
 * Restaurant Order Management - Service Layer
 */
import { Order, OrderApiResponse } from "./Order.types";

const API_URL = "http://localhost:5231/api/Order/restaurant";
const UPDATE_STATUS_URL = "http://localhost:5231/api/Order/status";

/**
 * Fetches restaurant orders from the API
 * @returns Promise with array of orders
 */
export async function getRestaurantOrders(): Promise<Order[]> {
  try {
    // Get token from localStorage
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      throw new Error("Authentication token not found");
    }

    const token = JSON.parse(tokenData);

    // Make API request with authorization header
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check if response is okay
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }

    // Parse response
    const data: OrderApiResponse = await response.json();

    // Return the orders array from the response
    return data.$values;
  } catch (error) {
    console.error("Error fetching restaurant orders:", error);
    throw error;
  }
}
/**
 * Updates the status of an order
 * @param orderId The ID of the order to update
 * @param newStatus The new status to set
 * @returns Promise with updated order
 */
export async function updateOrderStatus(
  orderId: number,
  newStatus: string
): Promise<Order> {
  try {
    // Get token from localStorage
    const tokenData = localStorage.getItem("token");

    if (!tokenData) {
      throw new Error("Authentication token not found");
    }
    const token = JSON.parse(tokenData);

    // Make API request to update order status
    const response = await fetch(`${UPDATE_STATUS_URL}/${orderId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderStatus: newStatus }),
    });

    console.log("Response from updateOrderStatus:", response);
    console.log("Response from updateOrderStatus:", newStatus);

    // Check if response is okay
    if (!response.ok) {
      throw new Error(
        `Failed to update order status. Server returned: ${response.status}`
      );
    }

    // Parse response
    const updatedOrder = await response.json();
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating status for order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Utility function to group orders by their status
 */
export function groupOrdersByStatus(orders: Order[]): Record<string, Order[]> {
  return orders.reduce((acc, order) => {
    const status = order.orderStatus;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(order);
    return acc;
  }, {} as Record<string, Order[]>);
}
