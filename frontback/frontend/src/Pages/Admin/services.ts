import { Restaurant, Manager } from './types';

// Define interfaces for API responses
interface OrderCountResponse {
  count: number;
}

interface CustomerCountResponse {
  count: number;
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5231/api';
const RESTAURANTS_API = import.meta.env.VITE_GET_ALL_RESTAURANTS_API || `${BASE_URL}/Restaurant`;

// Helper function to get auth token
const getAuthToken = (): string => {
  try {
    const tokenData = localStorage.getItem('token');
    if (!tokenData) {
      console.warn('No token found in localStorage');
      return '';
    }
    
    // Parse the token data
    const parsedData = JSON.parse(tokenData);
    
    // Check if the token is in the expected format
    if (typeof parsedData === 'string') {
      return parsedData; // Token is already a string
    } else if (parsedData && parsedData.token) {
      return parsedData.token; // Token is in an object with a token property
    } else if (parsedData && parsedData.accessToken) {
      return parsedData.accessToken; // Token is in an object with an accessToken property
    }
    
    console.warn('Token found but in unexpected format:', parsedData);
    return typeof parsedData === 'object' ? JSON.stringify(parsedData) : parsedData.toString();
  } catch (error) {
    console.error('Error parsing auth token:', error);
    return '';
  }
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Error: ${response.status}`);
  }

  const responseText = await response.text();
  return responseText ? JSON.parse(responseText) : {};
};

// Get all restaurants
export const getAllRestaurants = async (): Promise<Restaurant[]> => {
  try {
    const response = await fetch(RESTAURANTS_API, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await handleResponse(response);
    
    // Handle different response structures
    let restaurantsArray = [];
    if (Array.isArray(data)) {
      restaurantsArray = data;
    } else if (data && Array.isArray(data.$values)) {
      restaurantsArray = data.$values;
    }

    return restaurantsArray.map((restaurant: any) => ({
      id: restaurant.id?.toString() ?? '',
      name: restaurant.name ?? '',
      location: restaurant.location ?? '',
      description: restaurant.description ?? '',
      category: restaurant.category ?? '',
      managerId: restaurant.managerId?.toString() ?? '',
      contactInfo: restaurant.contactInfo ?? '',
      operatingHours: restaurant.operatingHours ?? '',
      imageUrl: restaurant.imageUrl ?? ''
    }));
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

// Add a new restaurant
export const addRestaurant = async (restaurant: Omit<Restaurant, 'id'>): Promise<Restaurant> => {
  try {
    console.log('Adding restaurant with data:', restaurant);
    console.log('Using token:', getAuthToken() ? 'Token exists' : 'No token');
    
    const response = await fetch(RESTAURANTS_API, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(restaurant)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Restaurant added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding restaurant:', error);
    throw error;
  }
};

// Delete a restaurant
export const deleteRestaurant = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${RESTAURANTS_API}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
};

// Get total order count
export const getOrderCount = async (): Promise<number> => {
  try {
    // Use the existing order API endpoint
    const orderApiUrl = import.meta.env.VITE_USER_ORDERS_API || `${BASE_URL}/Order`;
    const response = await fetch(`${orderApiUrl}/count`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle the response
    try {
      const data = await handleResponse(response) as OrderCountResponse;
      console.log('Order count response:', data); // Debug log
      // Handle both possible response formats
      if (typeof data === 'number') {
        return data;
      } else if (data && typeof data.count === 'number') {
        return data.count;
      } else {
        console.error('Unexpected order count response format:', data);
        return 0;
      }
    } catch (parseError) {
      console.error('Error parsing order count response:', parseError);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching order count:', error);
    return 0;
  }
};

// Get total customer count
export const getCustomerCount = async (): Promise<number> => {
  try {
    // Use the base users API endpoint
    const response = await fetch(`${BASE_URL}/Users/count`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    // Handle the response
    try {
      const data = await handleResponse(response) as CustomerCountResponse;
      console.log('Customer count response:', data); // Debug log
      // Handle both possible response formats
      if (typeof data === 'number') {
        return data;
      } else if (data && typeof data.count === 'number') {
        return data.count;
      } else {
        console.error('Unexpected customer count response format:', data);
        return 0;
      }
    } catch (parseError) {
      console.error('Error parsing customer count response:', parseError);
      return 0;
    }
  } catch (error) {
    console.error('Error fetching customer count:', error);
    return 0;
  }
};

// Get all restaurant owners/managers
export const getAllManagers = async (): Promise<Manager[]> => {
  try {
    console.log('Fetching all managers...');
    // Since managers are users with role 'RestaurantOwner', we need to fetch from the users endpoint
    const response = await fetch(`${BASE_URL}/Users`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Ensure we don't get cached results
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response when fetching managers:', errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    console.log('Raw managers data from API:', data);
    
    // Handle different response structures
    let usersArray = [];
    if (Array.isArray(data)) {
      usersArray = data;
    } else if (data && Array.isArray(data.$values)) {
      usersArray = data.$values;
    }

    console.log('Parsed users array:', usersArray);

    // Filter users with role 'RestaurantOwner'
    const managersArray = usersArray.filter((user: any) => {
      console.log(`User ${user.name} has role: ${user.role}`);
      return user.role === 'RestaurantOwner';
    });

    console.log('Filtered managers array:', managersArray);

    // Map the managers to our expected format
    const formattedManagers = managersArray.map((manager: any) => ({
      id: manager.id?.toString() ?? '',
      name: manager.name ?? '',
      email: manager.email ?? '',
      role: 'RestaurantOwner',
      phone: manager.phone ?? ''
    }));

    console.log('Formatted managers:', formattedManagers);
    return formattedManagers;
  } catch (error) {
    console.error('Error fetching restaurant managers:', error);
    throw error;
  }
};

// Add a new restaurant owner/manager (which is a user with role 'RestaurantOwner')
export const addManager = async (manager: Omit<Manager, 'id'> & { confirmPassword?: string }): Promise<Manager> => {
  try {
    console.log('Adding manager with data:', manager);
    
    // Prepare the request payload - note the lowercase 'c' in confirmPassword to match backend expectations
    const payload = {
      name: manager.name,
      email: manager.email,
      password: manager.password,
      confirmPassword: manager.confirmPassword, // Backend expects lowercase 'c'
      role: 'RestaurantOwner',
      phone: manager.phone || '',
      address: '', // Required by backend schema
      zipCode: '', // Required by backend schema
      cardId: 0 // Required by backend schema
    };
    
    console.log('Sending payload:', payload);
    
    // Use the register endpoint to create a new user with role 'RestaurantOwner'
    const response = await fetch(`${BASE_URL}/Users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // Removed Authorization header as it might not be needed for registration
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Manager added successfully:', data);
    return data;
  } catch (error) {
    console.error('Error adding restaurant manager:', error);
    throw error;
  }
};

// Delete a manager
export const deleteManager = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/Users/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`,
        'Content-Type': 'application/json'
      }
    });

    await handleResponse(response);
  } catch (error) {
    console.error('Error deleting restaurant manager:', error);
    throw error;
  }
};