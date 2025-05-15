import { Restaurant, Manager, createManager } from "./types";

const restaurantAPI = import.meta.env.VITE_GET_ALL_RESTAURANTS_API;
const orderAPI = import.meta.env.VITE_USER_ORDERS_API;
const userAPI = import.meta.env.VITE_USER_API;

const getAuthToken = (): string => {
  try {
    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      console.warn("No token found in localStorage");
      return "";
    }

    const token = JSON.parse(tokenData);
    return token;
  } catch (error) {
    console.error("Error parsing auth token:", error);
    return "";
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
    const response = await fetch(restaurantAPI, {
      method: "GET",
      headers: {
        Authorization: `bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Response from API:", restaurantAPI); // Debug log

    const data = await handleResponse(response);

    // Handle different response structures
    let restaurantsArray = [];
    if (Array.isArray(data)) {
      restaurantsArray = data;
    } else if (data && Array.isArray(data.$values)) {
      restaurantsArray = data.$values;
    }

    return restaurantsArray.map((restaurant: any) => ({
      id: restaurant.id?.toString() ?? "",
      name: restaurant.name ?? "",
      location: restaurant.location ?? "",
      description: restaurant.description ?? "",
      category: restaurant.category ?? "",
      managerId: restaurant.managerId?.toString() ?? "",
      contactInfo: restaurant.contactInfo ?? "",
      operatingHours: restaurant.operatingHours ?? "",
      imageUrl: restaurant.imageUrl ?? "",
    }));
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

// Add a new restaurant
export const addRestaurant = async (
  restaurant: Omit<Restaurant, "id">
): Promise<Restaurant> => {
  try {
    const response = await fetch(restaurantAPI, {
      method: "POST",
      headers: {
        Authorization: `bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurant),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error adding restaurant:", error);
    throw error;
  }
};

// Delete a restaurant
export const deleteRestaurant = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${restaurantAPI}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    await handleResponse(response);
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
};

// Get total order count
export const getOrderCount = async (): Promise<number> => {
  console.log("Fetching order count...", orderAPI);
  try {
    console.log("Fetching order count...", orderAPI);
    const response = await fetch(`${orderAPI}`, {
      method: "GET",
      headers: {
        Authorization: `bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      console.error("Server error response when fetching order count:");
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    console.log("Order count response:", data.$values); // Debug log
    return data.$values.length;
  } catch (error) {
    console.error("Error fetching order count:", error);
    return 0;
  }
};

// Get total customer count
export const getCustomerCount = async (): Promise<number> => {
  try {
    const response = await fetch(`${userAPI}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure we don't get cached results
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response when fetching managers:", errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    console.log("Raw managers data from API:", data);

    // Handle different response structures
    let usersArray = [];
    if (Array.isArray(data)) {
      usersArray = data;
    } else if (data && Array.isArray(data.$values)) {
      usersArray = data.$values;
    }

    console.log("Parsed users array:", usersArray);

    // Filter users with role 'RestaurantOwner'
    const managersArray = usersArray.filter((user: any) => {
      console.log(`User ${user.name} has role: ${user.role}`);
      return user.role === "Customer";
    });
    return managersArray.length;
  } catch (error) {
    console.error("Error fetching restaurant managers:", error);
    throw error;
  }
};

// Get all restaurant owners/managers
export const getAllManagers = async (): Promise<Manager[]> => {
  try {
    console.log("Fetching all managers...");
    // Since managers are users with role 'RestaurantOwner', we need to fetch from the users endpoint
    const response = await fetch(`${userAPI}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure we don't get cached results
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response when fetching managers:", errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }

    const responseText = await response.text();
    const data = responseText ? JSON.parse(responseText) : {};
    console.log("Raw managers data from API:", data);

    // Handle different response structures
    let usersArray = [];
    if (Array.isArray(data)) {
      usersArray = data;
    } else if (data && Array.isArray(data.$values)) {
      usersArray = data.$values;
    }

    console.log("Parsed users array:", usersArray);

    // Filter users with role 'RestaurantOwner'
    const managersArray = usersArray.filter((user: any) => {
      console.log(`User ${user.name} has role: ${user.role}`);
      return user.role === "RestaurantOwner";
    });

    console.log("Filtered managers array:", managersArray);

    // Map the managers to our expected format
    const formattedManagers = managersArray.map((manager: any) => ({
      userId: manager.userId?.toString() ?? "",
      name: manager.name ?? "",
      email: manager.email ?? "",
      role: "RestaurantOwner",
      phone: manager.phone ?? "",
    }));

    console.log("Formatted managers:", formattedManagers);
    return formattedManagers;
  } catch (error) {
    console.error("Error fetching restaurant managers:", error);
    throw error;
  }
};

// Add a new restaurant owner/manager (which is a user with role 'RestaurantOwner')
export const addManager = async (
  manager: createManager & { confirmPassword?: string }
): Promise<Manager> => {
  try {
    console.log("Adding manager with data:", manager);

    // Prepare the request payload - note the lowercase 'c' in confirmPassword to match backend expectations
    const payload = {
      name: manager.name,
      email: manager.email,
      password: manager.password,
      confirmPassword: manager.confirmPassword,
      role: "RestaurantOwner",
      phone: manager.phone || "",
      address: "",
      zipCode: "",
      cardId: 0,
    };

    console.log("Sending payload:", payload);

    // Use the register endpoint to create a new user with role 'RestaurantOwner'
    const response = await fetch(`${userAPI}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Removed Authorization header as it might not be needed for registration
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Server error response:", errorText);
      throw new Error(errorText || `Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Manager added successfully:", data);
    return data;
  } catch (error) {
    console.error("Error adding restaurant manager:", error);
    throw error;
  }
};
export const updateManager = async (
  id: string,
  manager: createManager
): Promise<void> => {
  const body = {
    name: manager.name,
    email: manager.email,
    phone: manager.phone,
  };
  try {
    const response = await fetch(`${userAPI}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    await handleResponse(response);
  } catch (error) {
    console.error("Error updating restaurant manager:", error);
    throw error;
  }
};

// Delete a manager
export const deleteManager = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${userAPI}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
        "Content-Type": "application/json",
      },
    });

    await handleResponse(response);
  } catch (error) {
    console.error("Error deleting restaurant manager:", error);
    throw error;
  }
};
