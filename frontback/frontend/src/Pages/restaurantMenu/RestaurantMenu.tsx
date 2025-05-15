import { useState, useEffect } from "react";
import { getFoodItemsByRestaurant } from "./service";
import { FoodItem } from "./types";
import FoodItemCard from "./FoodItemCard";
import CartSummary from "./CartSummary";
import { useLocation } from "react-router-dom";

interface CartItem extends FoodItem {
  quantity: number;
  notes?: string;
}

const RestaurantMenu = () => {
  // For demo purposes, we'll hardcode a restaurant ID
  // In a real app, you would get this from URL params or props
  const location = useLocation();
  const id = location.state?.id;

  if (!id) return <div>No restaurant selected</div>;

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchFoodItems = async () => {
      try {
        setLoading(true);
        const items = await getFoodItemsByRestaurant(Number(id));
        setFoodItems(items);
        setLoading(false);
      } catch (err) {
        setError("Failed to load menu items. Please try again later.");
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, [id]);

  const handleAddToCart = (item: CartItem) => {
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );

    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + item.quantity,
        notes: item.notes || updatedCart[existingItemIndex].notes,
      };
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, item]);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading menu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
      <h1 className="text-3xl font-bold mb-6">
        {foodItems.length > 0 ? foodItems[0].restaurantName : "Restaurant"} Menu
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodItems.map((foodItem) => (
          <FoodItemCard
            key={foodItem.id}
            foodItem={foodItem}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {foodItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No menu items available.</p>
        </div>
      )}

      <CartSummary
        cart={cart}
        onClearCart={clearCart}
        restaurantId={Number(id)}
      />
    </div>
  );
};

export default RestaurantMenu;
