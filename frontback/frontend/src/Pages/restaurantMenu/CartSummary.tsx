// CartSummary.tsx
import React, { useState } from "react";
import { FoodItem } from "./types";
import { useNavigate } from "react-router-dom";

interface CartItem extends FoodItem {
  quantity: number;
  notes?: string;
}

interface CartSummaryProps {
  cart: CartItem[];
  onClearCart: () => void;
  restaurantId?: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onClearCart,
  restaurantId,
}) => {
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const getTotalItems = (): number => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = (): string => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return total.toFixed(2);
  };

  const toggleCart = (): void => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCheckout = (): void => {
    // Navigate to checkout page
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }
    navigate("/checkout", {
      state: {
        cart: cart,
        restaurantId: restaurantId,
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
      {isCartOpen && cart.length > 0 && (
        <div className="container mx-auto p-4 border-t border-b">
          <h3 className="text-lg font-bold mb-3">Your Order</h3>
          <div className="max-h-64 overflow-y-auto">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <span className="font-medium">{item.name}</span>
                  <div className="text-sm text-gray-600 mt-1">
                    Qty: {item.quantity}
                    {item.notes && (
                      <span className="ml-2">- Note: {item.notes}</span>
                    )}
                  </div>
                </div>
                <div className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center font-bold">
            <span>Total:</span>
            <span>${getTotalPrice()}</span>
          </div>
        </div>
      )}

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center">
          <div>
            {cart.length > 0 ? (
              <button
                onClick={toggleCart}
                className="flex items-center text-gray-700"
                type="button"
              >
                <span className="bg-crimson text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                  {getTotalItems()}
                </span>
                <span>
                  {getTotalItems() === 1
                    ? "1 item"
                    : `${getTotalItems()} items`}{" "}
                  in cart
                </span>
                <svg
                  className={`w-4 h-4 ml-1 transform ${
                    isCartOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <span className="text-gray-500">Your cart is empty</span>
            )}
          </div>

          <div className="flex gap-2">
            {cart.length > 0 && (
              <>
                <button
                  onClick={onClearCart}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md transition-colors"
                  type="button"
                >
                  Clear
                </button>

                <button
                  onClick={handleCheckout}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
                  type="button"
                >
                  Checkout
                </button>
              </>
            )}

            {cart.length === 0 && (
              <button
                className="bg-gray-300 text-gray-500 py-2 px-6 rounded-md font-medium cursor-not-allowed"
                disabled
                type="button"
              >
                Checkout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
