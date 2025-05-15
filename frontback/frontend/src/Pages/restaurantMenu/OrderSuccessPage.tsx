import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderTotal, setOrderTotal] = useState<string>("0.00");
  const [restaurantName, setRestaurantName] = useState<string>("Restaurant");
  const [orderId, setOrderId] = useState<string>(
    `ORD-${Math.floor(100000 + Math.random() * 900000)}`
  );

  useEffect(() => {
    if (location.state) {
      if (location.state.orderTotal) {
        setOrderTotal(location.state.orderTotal);
      }
      if (location.state.restaurantName) {
        setRestaurantName(location.state.restaurantName);
      }
    }

    // If no state is passed, the user probably navigated here directly
    // In a real app, we would want to redirect them
    if (!location.state) {
      setTimeout(() => {
        navigate("/");
      }, 5000);
    }
  }, [location, navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-600">
            Your order has been placed successfully.
          </p>
        </div>

        <div className="border-t border-b py-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID:</span>
            <span className="font-medium">{orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Restaurant:</span>
            <span className="font-medium">{restaurantName}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span>Total:</span>
            <span>${orderTotal}</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            You'll receive updates about your order via email or text message.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md font-medium transition-colors"
              type="button"
            >
              Order Again
            </button>
            <button
              onClick={() => navigate("/Customer-profile")} // You could implement this in the future
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-6 rounded-md font-medium transition-colors"
              type="button"
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
