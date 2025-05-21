// Type definitions
export interface OrderItem {
  id: number;
  foodItemName: string;
  foodItemId: number;
  quantity: number;
  price: number;
}
export interface ReviewData {
  rating: number;
  comment: string;
  restaurantId: number;
}

export interface Order {
  id: number;
  restaurantId: string;
  restaurantImage: string;
  restaurantName: string;
  paymentMethod: string;
  TotalPrice: number;
  orderDate: string;
  orderStatus: string;
  notes: string;
  orderItem: OrderItem[];
}
export interface CustomerData {
  userId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  zipCode: string;
  cardId?: string; // Optional field
}
