import { Restaurant, RestaurantAPIResponse } from "./constants";
const restaurantAPI = import.meta.env.VITE_GET_ALL_RESTAURANTS_API;

export const getRestaurantsCardsInfo = async (): Promise<Restaurant[]> => {
  try {
    const response = await fetch(`${restaurantAPI}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Get the response text first (for debugging purposes)
    const responseText = await response.text();
    console.log("Response body:", responseText);

    // Parse the JSON manually after logging it
    const jsonData = JSON.parse(responseText);
    console.log("API response data:", jsonData);

    // Properly determine the array of restaurants
    let restaurantsArray: RestaurantAPIResponse[] = [];

    // Check different possible response structures
    if (Array.isArray(jsonData)) {
      // If the root is already an array
      restaurantsArray = jsonData;
    } else if (jsonData && Array.isArray(jsonData.$values)) {
      // If it's an object with a $values array property
      restaurantsArray = jsonData.$values;
    }

    console.log("Parsed restaurants array:", restaurantsArray);

    // Now map over the array
    return restaurantsArray.map((restaurant) => {
      const reviewsArray = restaurant.reviews?.$values || [];

      return {
        id: restaurant.id?.toString() ?? "",
        name: restaurant.name ?? "",
        rating: restaurant.rating ?? 0,
        location: restaurant.location ?? "",
        description: restaurant.description ?? "",
        category: restaurant.category ?? "",
        avgDeliveryTime: restaurant.avgDeliveryTime ?? 0,
        managerId: restaurant.managerId?.toString() ?? "",
        contactInfo: restaurant.contactInfo ?? "",
        operatingHours: restaurant.operatingHours ?? "",
        imageUrl: restaurant.imageUrl ?? "",
        foodItems: restaurant.foodItems ?? [],
        reviews: reviewsArray.length,
        reviewsData: reviewsArray,
      };
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return [];
  }
};

// Add function to get a restaurant's average rating from its reviews
export const calculateAverageRating = (reviews: any[]): number => {
  if (!reviews || reviews.length === 0) return 0;

  const sum = reviews.reduce((total, review) => total + review.rating, 0);
  return sum / reviews.length;
};
