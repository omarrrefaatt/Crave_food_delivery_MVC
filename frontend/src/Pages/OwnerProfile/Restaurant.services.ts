// src/services/RestaurantService.ts
import axios from "axios";
const restaurantAPI = import.meta.env.VITE_GET_ALL_RESTAURANTS_API;
import { Restaurant } from "./types";

export const getMyRestaurant = async (): Promise<Restaurant> => {
  const tokenData = localStorage.getItem("token");
  if (!tokenData) {
    throw new Error("Authentication token not found");
  }
  const token = JSON.parse(tokenData);
  try {
    const response = await axios.get(`${restaurantAPI}/getMyRestaurant`, {
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
