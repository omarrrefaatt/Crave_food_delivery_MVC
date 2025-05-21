// src/services/RestaurantService.ts
import axios from "axios";

// Define the Restaurant interface
export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  location: string;
  description: string;
  category: string;
  avgDeliveryTime: number;
  contactInfo: string;
  operatingHours: string;
  imageUrl: string;
  totalRevnue: number;
  totalSucsessOrders: number;
  totalOrders: number;
  totalCancelledOrders: number;
  reviews: any[] | null;
}

const API_URL = "http://localhost:5231/api";

export const getMyRestaurant = async (): Promise<Restaurant> => {
  const tokenData = localStorage.getItem("token");
  if (!tokenData) {
    throw new Error("Authentication token not found");
  }
  const token = JSON.parse(tokenData);
  try {
    const response = await axios.get(`${API_URL}/Restaurant/getMyRestaurant`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    throw error;
  }
};

const RestaurantService = {
  getMyRestaurant,
};
export default RestaurantService;
