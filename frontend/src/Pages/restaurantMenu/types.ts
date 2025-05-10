// types.ts

// Base food item type from API
export interface FoodItem {
  id: number;
  name: string;
  description: string;
  rating: number;
  price: number;
  restaurantId: number;
  restaurantName: string;
  imageUrl: string;
}

// Food item with quantity for cart
export interface CartItem extends FoodItem {
  quantity: number;
  notes?: string;
}

// API response format
export interface ApiResponse {
  $id: string;
  $values: FoodItem[];
}
export interface OrderItem {
  foodItemId: number;
  quantity: number;
}

export interface OrderRequest {
  restaurantId: number;
  orderItem: OrderItem[];
  notes: string;
  paymentMethod: string;
}
