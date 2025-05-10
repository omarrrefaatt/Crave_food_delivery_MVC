import { FoodItem, ApiResponse, OrderRequest } from "./types";

export const getFoodItemsByRestaurant = async (
  restaurantId: number
): Promise<FoodItem[]> => {
  try {
    const response = await fetch(
      `http://localhost:5231/api/FoodItems/by-restaurant/${restaurantId}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching food items: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    console.log("Response data:", data.$values);
    return data.$values || [];
  } catch (error) {
    console.error("Failed to fetch food items:", error);
    throw error;
  }
};

export const placeOrder = async (orderData: OrderRequest, token: string) => {
  try {
    token = JSON.parse(token);
    console.log("Placing order with data:", orderData, token);
    const response = await fetch("http://localhost:5231/api/Order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error(`Error placing order: ${response.status}`);
    }
    const data = await response.json();
    console.log("Order placed successfully:", data);

    return;
  } catch (error) {
    console.error("Failed to place order:", error);
    throw error;
  }
};
