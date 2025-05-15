export interface Review {
  id: number;
  rating: number;
  comment: string;
  restaurantId: number;
  userId: number;
  createdAt: string;
}

export interface ReviewsResponse {
  $id: string;
  $values: Review[];
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  location: string;
  description: string;
  avgDeliveryTime: number;
  category: string;
  managerId: string;
  contactInfo: string;
  operatingHours: string;
  imageUrl: string;
  foodItems: any;
  reviews: number;
  reviewsData?: Review[]; // Optional property to store actual review data if needed
}

export interface RestaurantAPIResponse {
  $id: string;
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
  managerId: number;
  foodItems: any;
  reviews: ReviewsResponse;
}
