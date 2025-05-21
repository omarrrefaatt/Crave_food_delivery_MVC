import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FoodItem, FoodItemFormData, ApiStatus } from "./foodItemTypes";
import EnhancedFoodItemForm from "./FoodItemForm";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiChevronLeft,
  FiGrid,
  FiList,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import BackNavBar from "./components/BackNavBar";

// Toast component for notifications
interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  show: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, show, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 p-4 rounded-md text-white shadow-lg z-50 ${bgColor}`}
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-white">
          ×
        </button>
      </div>
    </div>
  );
};

const RestaurantOwnerPage: React.FC = () => {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FoodItem[]>([]);
  const [formMode, setFormMode] = useState<"create" | "edit" | "hidden">(
    "hidden"
  );
  const [selectedItem, setSelectedItem] = useState<
    FoodItemFormData | undefined
  >();
  const [apiStatus, setApiStatus] = useState<Record<string, ApiStatus>>({
    fetch: ApiStatus.IDLE,
    submit: ApiStatus.IDLE,
    delete: ApiStatus.IDLE,
  });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortOption, setSortOption] = useState<
    "name" | "price-asc" | "price-desc" | "rating"
  >("name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [toast, setToast] = useState({
    message: "",
    type: "info" as "success" | "error" | "info",
    show: false,
  });

  const [authToken, setAuthToken] = useState<string | null>(null);

  // Show toast notification
  const showToast = (message: string, type: "success" | "error" | "info") => {
    setToast({
      message,
      type,
      show: true,
    });
  };

  // Hide toast notification
  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  };

  // Configure axios with authentication token
  useEffect(() => {
    // In a real app, you'd get this from your auth context or localStorage
    const token = localStorage.getItem("token");
    setAuthToken(token);

    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    return () => {
      delete axios.defaults.headers.common["Authorization"];
    };
  }, []);

  const fetchFoodItems = useCallback(async () => {
    setApiStatus((prev) => ({ ...prev, fetch: ApiStatus.LOADING }));

    try {
      const tokenString = localStorage.getItem("token");

      if (tokenString) {
        const token = JSON.parse(tokenString);
        const response = await axios.get(
          `http://localhost:5231/api/FoodItems`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched food items:", response.data.$values);

        setFoodItems(response.data.$values);
        setFilteredItems(response.data.$values);
        setApiStatus((prev) => ({ ...prev, fetch: ApiStatus.SUCCESS }));
      }
    } catch (error) {
      console.error("Error fetching food items:", error);
      setApiStatus((prev) => ({ ...prev, fetch: ApiStatus.ERROR }));
      showToast("Failed to load food items. Please try again.", "error");
    }
  }, []);

  // Initial fetch on component mount or restaurantId change
  useEffect(() => {
    fetchFoodItems();
  }, [fetchFoodItems]);
  // Filter items when search term changes
  useEffect(() => {
    if (!searchTerm.trim() && foodItems.length > 0) {
      sortItems(foodItems);
      return;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    const filtered = foodItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerCaseSearch) ||
        item.description.toLowerCase().includes(lowerCaseSearch)
    );
    sortItems(filtered);
  }, [searchTerm, foodItems, sortOption]);

  // Sort items based on selected option
  const sortItems = (items: FoodItem[]) => {
    let sorted = [...items];

    switch (sortOption) {
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    setFilteredItems(sorted);
  };

  // Create or update food item
  const handleSubmit = async (formData: FoodItemFormData) => {
    if (!authToken) {
      showToast("You must be logged in to perform this action", "error");
      return;
    }

    setApiStatus((prev) => ({ ...prev, submit: ApiStatus.LOADING }));

    try {
      if (formMode === "create") {
        const tokenString = localStorage.getItem("token");

        if (tokenString) {
          const token = JSON.parse(tokenString);
          await axios.post(`http://localhost:5231/api/FoodItems`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("Fetched food items:");
        }
        showToast("Food item created successfully!", "success");
      } else {
        const tokenString = localStorage.getItem("token");
        if (tokenString) {
          const token = JSON.parse(tokenString);
          await axios.put(
            `http://localhost:5231/api/FoodItems/${selectedItem?.id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("Fetched food items:");
        }
        showToast("Food item updated successfully!", "success");
      }

      setApiStatus((prev) => ({ ...prev, submit: ApiStatus.SUCCESS }));
      setFormMode("hidden");
      setSelectedItem(undefined);
      fetchFoodItems(); // Refresh the list to ensure we have the latest data
    } catch (error) {
      console.error("Error saving food item:", error);
      setApiStatus((prev) => ({ ...prev, submit: ApiStatus.ERROR }));
      showToast("Failed to save food item. Please try again.", "error");
    }
  };

  // Delete food item
  const handleDelete = async (itemId: number) => {
    if (!authToken) {
      showToast("You must be logged in to perform this action", "error");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this food item?")) {
      return;
    }

    setApiStatus((prev) => ({ ...prev, delete: ApiStatus.LOADING }));

    try {
      const tokenString = localStorage.getItem("token");

      if (tokenString) {
        const token = JSON.parse(tokenString);
        await axios.delete(`http://localhost:5231/api/FoodItems/${itemId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      setFoodItems((prev) => prev.filter((item) => item.id !== itemId));
      showToast("Food item deleted successfully!", "success");
      setApiStatus((prev) => ({ ...prev, delete: ApiStatus.SUCCESS }));
    } catch (error) {
      console.error("Error deleting food item:", error);
      setApiStatus((prev) => ({ ...prev, delete: ApiStatus.ERROR }));
      showToast("Failed to delete food item. Please try again.", "error");
    }
  };

  const handleEdit = (item: FoodItem) => {
    setSelectedItem(item);
    setFormMode("edit");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCreateNew = () => {
    setSelectedItem({
      name: "",
      description: "",
      rating: 5,
      restaurantId: 0,
      imageUrl: "",
      price: 0,
    });
    setFormMode("create");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setFormMode("hidden");
    setSelectedItem(undefined);
  };

  // Rating stars component
  const RatingStars = ({ rating }: { rating: number }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-${star <= rating ? "yellow-400" : "gray-300"}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <BackNavBar />

      <h1 className="text-2xl font-bold mb-6">Food Item Management</h1>

      {/* Toast notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={hideToast}
      />

      {/* Food Item Form */}
      {formMode !== "hidden" && (
        <div className="mb-8">
          <EnhancedFoodItemForm
            initialData={selectedItem}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={apiStatus.submit === ApiStatus.LOADING}
          />
        </div>
      )}

      {/* Search and Add New */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center">
          <h2 className="text-xl font-semibold mr-4">Menu Items</h2>
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${
                viewMode === "grid" ? "bg-white shadow-sm" : ""
              }`}
              title="Grid View"
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${
                viewMode === "list" ? "bg-white shadow-sm" : ""
              }`}
              title="List View"
            >
              <FiList />
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-3 md:space-y-0 md:space-x-4 w-full md:w-auto mt-3 md:mt-0">
          <div className="relative w-full md:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md w-full"
            />
          </div>

          <select
            value={sortOption}
            onChange={(e) =>
              setSortOption(
                e.target.value as "name" | "price-asc" | "price-desc" | "rating"
              )
            }
            className="px-4 py-2 border rounded-md w-full md:w-auto"
          >
            <option value="name">Sort by: Name</option>
            <option value="price-asc">Sort by: Price (Low to High)</option>
            <option value="price-desc">Sort by: Price (High to Low)</option>
            <option value="rating">Sort by: Rating</option>
          </select>

          <button
            onClick={handleCreateNew}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 w-full md:w-auto justify-center"
          >
            <FiPlus className="mr-1" /> Add New Item
          </button>
        </div>
      </div>

      {/* Food Items List */}
      {apiStatus.fetch === ApiStatus.LOADING ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading food items...</p>
        </div>
      ) : filteredItems.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/300x200?text=Image+Not+Available";
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-green-600">
                      ${item.price.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <RatingStars rating={item.rating} />
                      <span className="text-sm text-gray-500 ml-1">
                        ({item.rating})
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <button
                      onClick={() => handleEdit(item)}
                      className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                      title="Edit"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                      title="Delete"
                      disabled={apiStatus.delete === ApiStatus.LOADING}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-12 w-12 rounded-md overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/300x200?text=Image+Not+Available";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {item.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">
                        ${item.price.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <RatingStars rating={item.rating} />
                        <span className="text-sm text-gray-500 ml-1">
                          ({item.rating})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
                          title="Edit"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                          title="Delete"
                          disabled={apiStatus.delete === ApiStatus.LOADING}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {foodItems.length > 0 ? (
            <>
              <p className="text-gray-500 mb-4">No items match your search.</p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Clear Search
              </button>
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-4">
                No food items found for this restaurant.
              </p>
              <button
                onClick={handleCreateNew}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Your First Item
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantOwnerPage;
