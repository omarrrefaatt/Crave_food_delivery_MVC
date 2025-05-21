/**
 * Restaurant Order Management - Type Definitions
 */

// Enum for order status
export enum OrderStatus {
  Pending = "Pending",
  Processing = "processing",
  Cancelled = "cancelled",
  Delivered = "delivered",
}

// Enum for payment methods
export enum PaymentMethod {
  CreditCard = "Credit Card",
  Cash = "Cash",
  DebitCard = "Debit Card",
  PayPal = "PayPal",
  Other = "Other",
}

// Interface for order items
export interface OrderItem {
  id: number;
  foodItemId: number;
  foodItemName: string;
  quantity: number;
  price: number;
}

// Interface for order item collection
export interface OrderItemCollection {
  $id?: string;
  $values: OrderItem[];
}

// Main Order interface
export interface Order {
  id: number;
  userId: number;
  restaurantId: number;
  restaurantImage: string;
  restaurantName: string;
  orderItem: OrderItemCollection;
  orderStatus: OrderStatus;
  orderDate: string;
  totalPrice: number;
  notes?: string;
  paymentMethod: PaymentMethod;
}

// API Response interface
export interface OrderApiResponse {
  $id: string;
  $values: Order[];
}
