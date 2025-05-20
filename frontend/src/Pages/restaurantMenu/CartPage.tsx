import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FoodItem } from "./types";
import { placeOrder } from "./service";
import { StripeProvider, StripePaymentForm } from "../../components/StripePayment";

interface CartItem extends FoodItem {
  quantity: number;
  notes?: string;
}

const CartPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<number | null>(null);
  const [notes, setNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("Credit Card");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showStripeForm, setShowStripeForm] = useState<boolean>(true);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  // Get cart items from location state
  useEffect(() => {
    if (location.state && location.state.cart) {
      setCart(location.state.cart);
    }
    if (location.state && location.state.restaurantId) {
      setRestaurantId(location.state.restaurantId);
    }
  }, [location]);

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

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setShowStripeForm(method === "Credit Card");
    // Reset payment ID if changing payment method
    if (method !== "Credit Card") {
      setPaymentId(null);
    }
  };

  const handlePaymentSuccess = (id: string) => {
    setPaymentId(id);
    setError(null);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(`Payment error: ${errorMessage}`);
    setPaymentId(null);
  };

  const handleSubmitOrder = async () => {
    try {
      if (!restaurantId) {
        setError("Restaurant information is missing");
        return;
      }

      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("User not logged in. Please log in to place an order.");
        return;
      }

      // If credit card payment is selected but no payment has been processed
      if (paymentMethod === "Credit Card" && !paymentId) {
        setError("Please complete the payment information before placing your order.");
        return;
      }

      setIsSubmitting(true);
      setError(null);

      const orderData = {
        userId: parseInt(userId),
        restaurantId: restaurantId,
        orderItem: cart.map((item) => ({
          foodItemId: item.id,
          quantity: item.quantity,
        })),
        notes: notes,
        paymentMethod: paymentMethod + (paymentId ? ` (ID: ${paymentId})` : ""),
      };
      let token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      console.log(token);

      await placeOrder(orderData, token);

      // Order successful
      navigate("/order-success", {
        state: {
          orderTotal: getTotalPrice(),
          restaurantName:
            cart.length > 0 ? cart[0].restaurantName : "Restaurant",
          paymentId: paymentId
        },
      });
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error("Order placement failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">
            Add some delicious items to your cart to place an order!
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-md font-medium"
            type="button"
          >
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {error && (
        <div
          className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {cart.length > 0 ? cart[0].restaurantName : "Restaurant"}
        </h2>

        <div className="mb-6">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center py-4 border-b"
            >
              <div className="flex items-center">
                <div className="w-20 h-20 rounded-md overflow-hidden mr-4">
                  <img
                    src={item.imageUrl || "/api/placeholder/80/80"}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600 text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                  {item.notes && (
                    <p className="text-sm text-gray-500 mt-1">
                      Note: {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <div className="flex items-center mr-6">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200"
                    type="button"
                  >
                    -
                  </button>
                  <span className="mx-3">{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200"
                    type="button"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <div className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 text-sm"
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <div className="flex justify-between mb-2">
            <span>Subtotal ({getTotalItems()} items)</span>
            <span>${getTotalPrice()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Delivery Fee</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
            <span>Total</span>
            <span>${getTotalPrice()}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>

        <div className="mb-4">
          <label htmlFor="notes" className="block text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            rows={3}
            placeholder="Add notes for your order (optional)"
          ></textarea>
        </div>

        <div className="mb-6">
          <label htmlFor="payment" className="block text-gray-700 mb-2">
            Payment Method
          </label>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="creditCard"
                name="paymentMethod"
                value="Credit Card"
                checked={paymentMethod === "Credit Card"}
                onChange={() => handlePaymentMethodChange("Credit Card")}
                className="mr-2"
              />
              <label htmlFor="creditCard" className="cursor-pointer">
                Credit Card
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="Cash"
                checked={paymentMethod === "Cash"}
                onChange={() => handlePaymentMethodChange("Cash")}
                className="mr-2"
              />
              <label htmlFor="cash" className="cursor-pointer">
                Cash on Delivery
              </label>
            </div>
          </div>
        </div>

        {showStripeForm && (
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-3">Payment Information</h3>
            <StripeProvider>
              <StripePaymentForm 
                amount={parseFloat(getTotalPrice())}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </StripeProvider>
            {paymentId && (
              <div className="mt-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded">
                Payment processed successfully! Payment ID: {paymentId}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-end">
        <button
          onClick={handleCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium"
          type="button"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmitOrder}
          disabled={isSubmitting}
          className={`${
            isSubmitting ? "bg-green-400" : "bg-green-500 hover:bg-green-600"
          } text-white py-3 px-8 rounded-md font-medium transition-colors flex items-center`}
          type="button"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </button>
      </div>
    </div>
  );
};

export default CartPage;
