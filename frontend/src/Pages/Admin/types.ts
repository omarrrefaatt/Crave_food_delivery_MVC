export interface Restaurant {
  id: string;
  name: string;
  location: string;
  description: string;
  category: string;
  managerId: string;
  contactInfo: string;
  operatingHours: string;
  imageUrl: string;
}

export interface Manager {
  // not required for now
  userId: string;
  name: string;
  email: string;
  role: string;
  password?: string;
  restaurantId?: string;
  phone?: string;
}
export interface createManager {
  name: string;
  email: string;
  role: string;
  password?: string;
  restaurantId?: string;
  phone?: string;
}
export interface FormError {
  field: string;
  message: string;
}
export interface DashboardProps {
  restaurants: Restaurant[];
  loading: boolean;
}

export interface DashboardStats {
  restaurants: number;
  managers: number;
  orders: number;
  customers: number;
}
