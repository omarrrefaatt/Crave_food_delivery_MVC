import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiCoffee,
  FiSettings,
  FiUsers,
  FiClipboard,
  FiTrendingUp,
  FiDollarSign,
  FiClock,
  FiPhone,
  FiCalendar,
  FiStar,
  FiMapPin,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";
import Navbar from "../../Common/Components/Navbar/navbar";
import { getMyRestaurant, Restaurant } from "./Restaurant.services";

const RestaurantOwnerPage: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRestaurantData = async (): Promise<void> => {
      try {
        const data = await getMyRestaurant();
        setRestaurant(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch restaurant data");
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !restaurant) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <h2 className="text-xl font-bold">Error</h2>
          <p>{error || "Restaurant data not available"}</p>
        </div>
      </div>
    );
  }

  const successRate =
    restaurant.totalOrders > 0
      ? (
          (restaurant.totalSucsessOrders / restaurant.totalOrders) *
          100
        ).toFixed(1)
      : "0";

  const pendingOrders: number =
    restaurant.totalOrders -
    restaurant.totalSucsessOrders -
    restaurant.totalCancelledOrders;
  const pendingOrdersPercent: number =
    restaurant.totalOrders > 0
      ? (pendingOrders / restaurant.totalOrders) * 100
      : 0;
  const successOrdersPercent: number =
    restaurant.totalOrders > 0
      ? (restaurant.totalSucsessOrders / restaurant.totalOrders) * 100
      : 0;
  const cancelledOrdersPercent: number =
    restaurant.totalOrders > 0
      ? (restaurant.totalCancelledOrders / restaurant.totalOrders) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Restaurant Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              {restaurant.imageUrl && (
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  className="h-16 w-16 object-cover rounded-full border-2 border-white mr-4"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">{restaurant.name}</h1>
                <div className="flex items-center mt-1">
                  <FiStar className="mr-1" />
                  <span className="mr-3">{restaurant.rating} Rating</span>
                  <FiMapPin className="mr-1" />
                  <span>{restaurant.location}</span>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 p-3 rounded-lg">
              <div className="flex items-center">
                <FiPhone className="mr-2" />
                <span>{restaurant.contactInfo}</span>
              </div>
              <div className="flex items-center mt-1">
                <FiClock className="mr-2" />
                <span>{restaurant.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FiDollarSign className="text-green-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold">
                  ${restaurant.totalRevnue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiCheckCircle className="text-blue-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Successful Orders</p>
                <p className="text-2xl font-bold">
                  {restaurant.totalSucsessOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FiXCircle className="text-red-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Cancelled Orders</p>
                <p className="text-2xl font-bold">
                  {restaurant.totalCancelledOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FiTrendingUp className="text-purple-500 text-xl" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Success Rate</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Restaurant Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-start mb-3">
                <div className="bg-orange-100 p-2 rounded-full mr-3">
                  <FiInfo className="text-orange-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Description</p>
                  <p className="font-medium">{restaurant.description}</p>
                </div>
              </div>

              <div className="flex items-start mb-3">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <FiCoffee className="text-green-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="font-medium">{restaurant.category}</p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start mb-3">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <FiClock className="text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Average Delivery Time</p>
                  <p className="font-medium">
                    {restaurant.avgDeliveryTime} hours
                  </p>
                </div>
              </div>

              <div className="flex items-start mb-3">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <FiUsers className="text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Total Orders</p>
                  <p className="font-medium">{restaurant.totalOrders}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Stats Visualization */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Order Statistics
          </h2>
          <div className="flex flex-col md:flex-row justify-around items-center">
            {/* Success Rate Gauge */}
            <div className="relative w-40 h-40 mb-4 md:mb-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="10"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={parseFloat(successRate) > 50 ? "#10b981" : "#ef4444"}
                  strokeWidth="10"
                  strokeDasharray={`${parseFloat(successRate) * 2.83} 283`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text
                  x="50"
                  y="50"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-lg font-bold"
                  fill="#374151"
                >
                  {successRate}%
                </text>
                <text
                  x="50"
                  y="65"
                  dominantBaseline="middle"
                  textAnchor="middle"
                  className="text-xs"
                  fill="#6b7280"
                >
                  Success Rate
                </text>
              </svg>
            </div>

            {/* Order Distribution */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-medium mb-3">Order Distribution</h3>
              <div className="w-full max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div className="text-sm text-gray-600 mr-2">Successful</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${successOrdersPercent}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {restaurant.totalSucsessOrders}
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                  <div className="text-sm text-gray-600 mr-2">Cancelled</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-red-500 h-2 rounded-full"
                      style={{ width: `${cancelledOrdersPercent}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {restaurant.totalCancelledOrders}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                  <div className="text-sm text-gray-600 mr-2">Pending</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${pendingOrdersPercent}%` }}
                    ></div>
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {pendingOrders}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/RestaurantOwner-profile/food-management"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center border-l-4 border-orange-500 group"
          >
            <div className="bg-orange-100 p-3 rounded-full mr-4 group-hover:bg-orange-200 transition-colors">
              <FiCoffee className="text-2xl text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Food Item Management
              </h2>
              <p className="text-gray-600">
                Add, edit and remove food items from your menu
              </p>
            </div>
          </Link>

          <Link
            to="/RestaurantOwner-profile/order-management"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center border-l-4 border-blue-500 group"
          >
            <div className="bg-blue-100 p-3 rounded-full mr-4 group-hover:bg-blue-200 transition-colors">
              <FiUsers className="text-2xl text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Orders</h2>
              <p className="text-gray-600">View and manage customer orders</p>
            </div>
          </Link>

          <Link
            to="/RestaurantOwner-profile/restaurant-profile"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center border-l-4 border-green-500 group"
          >
            <div className="bg-green-100 p-3 rounded-full mr-4 group-hover:bg-green-200 transition-colors">
              <FiClipboard className="text-2xl text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Restaurant Profile</h2>
              <p className="text-gray-600">
                Update your restaurant information
              </p>
            </div>
          </Link>

          <Link
            to="/RestaurantOwner-profile/settings"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center border-l-4 border-purple-500 group"
          >
            <div className="bg-purple-100 p-3 rounded-full mr-4 group-hover:bg-purple-200 transition-colors">
              <FiSettings className="text-2xl text-purple-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Settings</h2>
              <p className="text-gray-600">
                Configure your restaurant settings
              </p>
            </div>
          </Link>

          <Link
            to="/RestaurantOwner-profile/analytics"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center border-l-4 border-indigo-500 group"
          >
            <div className="bg-indigo-100 p-3 rounded-full mr-4 group-hover:bg-indigo-200 transition-colors">
              <FiTrendingUp className="text-2xl text-indigo-500" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-1">Analytics</h2>
              <p className="text-gray-600">
                View detailed business analytics and reports
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOwnerPage;
