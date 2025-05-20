// Types related to food items for restaurant owners

export interface FoodItem {
  id: number;
  name: string;
  description: string;
  rating: number;
  restaurantId: number;
  restaurantName: string; // Added to match backend response
  imageUrl: string;
  price: number;
}

export interface FoodItemFormData {
  id?: number;
  name: string;
  description: string;
  rating: number;
  restaurantId: number;
  imageUrl: string;
  price: number;
}

export interface FoodItemError {
  name?: string;
  description?: string;
  rating?: string;
  restaurantId?: string;
  imageUrl?: string;
  price?: string;
}

export enum ApiStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
}

// Auth related types
export interface User {
  id: number;
  userName: string;
  email: string;
  role: string;
  restaurantId?: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}
