import React, { useState, useEffect } from "react";
import {
  getRestaurantOrders,
  groupOrdersByStatus,
  updateOrderStatus,
} from "./order.services";
import { Order, OrderStatus } from "./Order.types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackNavBar from "./components/BackNavBar";

const OrderManagementPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [processingOrderId, setProcessingOrderId] = useState<number | null>(
    null
  );

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders when search term or status filter changes
  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRestaurantOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError("Failed to fetch orders. Please try again later.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on search term and status
  const filterOrders = () => {
    let filtered = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    // Filter by search term (user ID or food item name)
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          // Match by user ID
          order.userId.toString().includes(searchTerm) ||
          // Match by food item name
          order.orderItem.$values.some((item) =>
            item.foodItemName.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Handle order status update
  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    setProcessingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);

      // Update the local state with the new status
      //   const updatedOrders = orders.map((order) =>
      //     order.id === orderId ? { ...order, orderStatus: newStatus } : order
      //   );

      //   setOrders(updatedOrders);
      toast.success(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error(`Error updating order #${orderId} status:`, err);
      toast.error(
        `Failed to update order status: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setProcessingOrderId(null);
    }
  };

  // Get current page items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Get status badge color
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return "bg-yellow-100 text-yellow-800";
      case OrderStatus.Processing:
        return "bg-blue-100 text-blue-800";
      case OrderStatus.Delivered:
        return "bg-green-100 text-green-800";
      case OrderStatus.Cancelled:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  return (
    <div className="container mx-auto p-4">
      <BackNavBar />
      <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Restaurant Order Management
          </h1>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh Orders
          </button>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Orders
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by user ID or food item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="w-full md:w-64">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Status
              </label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value={OrderStatus.Pending}>Pending</option>
                <option value={OrderStatus.Processing}>Processing</option>
                <option value={OrderStatus.Delivered}>Delivered</option>
                <option value={OrderStatus.Cancelled}>Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow mb-8"
            role="alert"
          >
            <div className="flex items-center">
              <svg
                className="h-6 w-6 text-red-500 mr-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && filteredOrders.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-10 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-xl text-gray-500 mt-4">
              No orders found matching your criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Orders Display - Card View */}
        {!loading && !error && filteredOrders.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupOrdersByStatus(currentItems)).map(
              ([status, statusOrders]) => (
                <div key={status} className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-6 flex items-center">
                    <span
                      className={`w-4 h-4 rounded-full mr-2 ${
                        status === OrderStatus.Pending
                          ? "bg-yellow-400"
                          : status === OrderStatus.Processing
                          ? "bg-blue-500"
                          : status === OrderStatus.Delivered
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></span>
                    {status.charAt(0).toUpperCase() + status.slice(1)} Orders
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statusOrders.map((order) => (
                      <div
                        key={order.id}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
                      >
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="font-bold text-gray-900">
                              Order #{order.id}
                            </span>
                            <span
                              className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(
                                order.orderStatus as OrderStatus
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {formatDate(order.orderDate)}
                          </span>
                        </div>

                        <div className="px-4 py-3">
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                User #{order.userId}
                              </div>
                              <div className="text-sm text-gray-500">
                                {order.paymentMethod}
                              </div>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm font-medium text-gray-700 mb-1">
                              Items:
                            </div>
                            <ul className="space-y-1">
                              {order.orderItem.$values.map((item) => (
                                <li
                                  key={item.id}
                                  className="text-sm flex justify-between"
                                >
                                  <span>
                                    {item.quantity}x {item.foodItemName}
                                  </span>
                                  <span className="font-medium">
                                    $
                                    {(
                                      (item.price * item.quantity) /
                                      100
                                    ).toFixed(2)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                            <span className="font-bold">Total</span>
                            <span className="font-bold text-lg">
                              ${(order.totalPrice / 100).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Status Update Buttons */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                          {order.orderStatus === OrderStatus.Pending && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "processing")
                                }
                                disabled={processingOrderId === order.id}
                                className="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-50"
                              >
                                {processingOrderId === order.id
                                  ? "Processing..."
                                  : "Confirm Order"}
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusUpdate(order.id, "cancelled")
                                }
                                disabled={processingOrderId === order.id}
                                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50"
                              >
                                {processingOrderId === order.id
                                  ? "Processing..."
                                  : "Cancel Order"}
                              </button>
                            </div>
                          )}

                          {order.orderStatus === OrderStatus.Processing && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(order.id, "delivered")
                              }
                              disabled={processingOrderId === order.id}
                              className="w-full px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
                            >
                              {processingOrderId === order.id
                                ? "Processing..."
                                : "Mark as Delivered"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 rounded-l-md border ${
                  currentPage === 1
                    ? "border-gray-300 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`relative inline-flex items-center px-4 py-2 border ${
                    currentPage === index + 1
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center px-4 py-2 rounded-r-md border ${
                  currentPage === totalPages
                    ? "border-gray-300 bg-gray-100 text-gray-400"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagementPage;
