import { Link } from "react-router-dom";
import {
  FiCoffee,
  FiSettings,
  FiUsers,
  FiClipboard,
  FiTrendingUp,
} from "react-icons/fi";
import Navbar from "../../Common/Components/Navbar/navbar";

const RestaurantOwnerPage = () => {
  // Placeholder data - would come from API in a real application
  const restaurantInfo = {
    name: "Delicious Restaurant",
    ordersToday: 12,
    totalRevenue: 560.5,
    pendingOrders: 3,
  };

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <div className="bg-crimson text-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold">Restaurant Owner Dashboard</h1>
          <p className="mt-2">
            Welcome to {restaurantInfo.name} management portal
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full mr-4">
                <FiTrendingUp className="text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Today's Orders</p>
                <p className="text-xl font-bold">
                  {restaurantInfo.ordersToday}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FiUsers className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Orders</p>
                <p className="text-xl font-bold">
                  {restaurantInfo.pendingOrders}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <FiSettings className="text-purple-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <p className="text-xl font-bold">
                  ${restaurantInfo.totalRevenue.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-4">Management Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/RestaurantOwner-profile/food-management"
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow flex items-center border-l-4 border-orange-500"
          >
            <FiCoffee className="text-3xl text-orange-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold mb-1">
                Food Item Management
              </h2>
              <p className="text-gray-600">
                Add, edit and remove food items from your menu
              </p>
            </div>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center opacity-70 border-l-4 border-blue-500">
            <FiUsers className="text-3xl text-blue-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold mb-1">Orders</h2>
              <p className="text-gray-600">View and manage customer orders</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center opacity-70 border-l-4 border-green-500">
            <FiClipboard className="text-3xl text-green-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold mb-1">Restaurant Profile</h2>
              <p className="text-gray-600">
                Update your restaurant information
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center opacity-70 border-l-4 border-purple-500">
            <FiSettings className="text-3xl text-purple-500 mr-4" />
            <div>
              <h2 className="text-xl font-semibold mb-1">Settings</h2>
              <p className="text-gray-600">
                Configure your restaurant settings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOwnerPage;
