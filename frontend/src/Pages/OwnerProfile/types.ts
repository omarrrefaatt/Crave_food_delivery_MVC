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

export interface Review {
  id: number;
  rating: number;
  comment: string;
  restaurantId: number;
  userName: string;
  userId: number;
  createdAt: string;
}

export interface ReviewApiResponse {
  $id: string;
  $values: Review[];
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
}
