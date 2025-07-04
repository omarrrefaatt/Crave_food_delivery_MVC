import React, { useEffect, useState } from "react";
import Navbar from "../../Common/Components/Navbar/navbar";
import styles from "./Customer.module.css";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaCreditCard,
  FaMapMarkerAlt as FaZipCode,
  FaReceipt,
  FaStar,
  FaRegStar,
  FaTimes,
} from "react-icons/fa";
import defaultProfilePhoto from "../../assets/default_profile_photo.png";
import {
  get_current_customer,
  get_customer_orders,
  submit_restaurant_review,
  cancel_order,
  update_customer_profile,
} from "./services";
import { CustomerData, Order, ReviewData } from "./types";

const Customer: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Edit profile states
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<CustomerData>({
    userId: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    zipCode: "",
    cardId: "",
  });
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<boolean>(false);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({
    rating: 0,
    comment: "",
    restaurantId: 0,
  });
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const tokenString = localStorage.getItem("token");

      if (tokenString) {
        const token = JSON.parse(tokenString);

        try {
          // Fetch customer data
          const customerResponse = await get_current_customer(token);
          if (customerResponse && customerResponse.user) {
            setCustomerData(customerResponse.user);
            localStorage.setItem(
              "userId",
              JSON.stringify(customerResponse.user.userId)
            );
          }

          // Fetch order data
          const ordersResponse = await get_customer_orders(token);
          if (ordersResponse && ordersResponse) {
            // Transform the data to match our enhanced Order interface
            const unwrappedOrders = ordersResponse.map((order: any) => {
              return {
                id: Number(order.id),
                restaurantId: order.restaurantId,
                restaurantImage: order.restaurantImage,
                restaurantName: order.restaurantName,
                paymentMethod: order.paymentMethod,
                TotalPrice: Number(order.totalPrice),
                orderDate: order.orderDate,
                orderStatus: order.orderStatus,
                notes: order.notes,
                orderItem: order.orderItem.$values.map((item: any) => ({
                  id: Number(item.id),
                  foodItemId: Number(item.foodItemId),
                  foodItemName: item.foodItemName,
                  quantity: item.quantity,
                  price: Number(item.price),
                })),
              };
            });
            unwrappedOrders.sort((a, b) => {
              return (
                new Date(b.orderDate).getTime() -
                new Date(a.orderDate).getTime()
              );
            });
            setOrders(unwrappedOrders);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  // Filter orders based on status
  const filteredOrders =
    activeFilter === "all"
      ? orders
      : orders.filter(
          (order) => order.orderStatus.toLowerCase() === activeFilter
        );

  const getStatusClassName = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return styles.statusPending;
      case "delivered":
        return styles.statusDelivered;
      case "cancelled":
        return styles.statusCancelled;
      case "processing":
        return styles.statusProcessing;
      default:
        return styles.statusPending;
    }
  };

  // Open review modal for a specific restaurant
  const openReviewModal = (restaurantId: number, restaurantName: string) => {
    setSelectedRestaurant({ id: restaurantId, name: restaurantName });
    setReviewData({
      rating: 0,
      comment: "",
      restaurantId: restaurantId,
    });
    setReviewSuccess(false);
    setReviewError(null);
    setShowReviewModal(true);
  };

  // Close review modal
  const closeReviewModal = () => {
    setShowReviewModal(false);
    setSelectedRestaurant(null);
  };

  // Handle star rating selection
  const handleRatingChange = (rating: number) => {
    setReviewData((prev) => ({ ...prev, rating }));
  };

  // Handle comment change
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewData((prev) => ({ ...prev, comment: e.target.value }));
  };

  // Submit review to API
  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (reviewData.rating === 0) {
      setReviewError("Please select a rating");
      return;
    }

    setReviewSubmitting(true);
    setReviewError(null);

    const tokenString = localStorage.getItem("token");

    if (!tokenString) {
      setReviewError("Authentication error. Please log in again.");
      setReviewSubmitting(false);
      return;
    }

    const token = JSON.parse(tokenString);

    try {
      await submit_restaurant_review(token, reviewData);
      setReviewSuccess(true);
      setTimeout(() => {
        closeReviewModal();
      }, 2000);
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError("Failed to submit review. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };
  const handleCancelClick = (orderId: number) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (selectedOrderId === null) return;

    try {
      setCancelError("");
      setCancelSuccess("");
      const tokenString = localStorage.getItem("token");
      if (!tokenString) {
        setCancelError("Authentication error. Please log in again.");
        return;
      }
      const token = JSON.parse(tokenString);

      await cancel_order(token, Number(selectedOrderId));
      setCancelSuccess("Order cancelled successfully.");
      setShowCancelModal(false);
      // Optional: refresh orders or UI here
    } catch (error: any) {
      setCancelError("Failed to cancel order. Please try again.");
    }
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedOrderId(null);
    setCancelError("");
  };

  // Edit profile functions
  const handleEditClick = () => {
    if (customerData) {
      setEditFormData(customerData);
      setIsEditMode(true);
      setEditError(null);
      setEditSuccess(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditMode(false);
    setEditFormData({
      userId: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      zipCode: "",
      cardId: "",
    });
    setEditError(null);
    setEditSuccess(false);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);

    const tokenString = localStorage.getItem("token");
    if (!tokenString) {
      setEditError("No authentication token found");
      setEditLoading(false);
      return;
    }

    const token = JSON.parse(tokenString);

    try {
      await update_customer_profile(token, editFormData);
      setCustomerData(editFormData);
      setEditSuccess(true);
      setTimeout(() => {
        setIsEditMode(false);
        setEditSuccess(false);
      }, 2000);
    } catch (error: any) {
      setEditError(error.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className={styles.customerContainer}>
      <Navbar />
      {/* Dashboard Header */}
      <div className={styles.dashboardHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>My Account Dashboard</h1>
        </div>
      </div>

      <div className={styles.mainContent}>
        {/* Left Panel - Profile Section */}
        <div className={styles.profileSection}>
          {/* Profile Card */}
          <div className={styles.profileCard}>
            <div className={styles.profileCardHeader}>
              <h2 className={styles.sectionTitle}>Profile Information</h2>
              <div>
                <FaEdit
                  onClick={handleEditClick}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
            <div className={styles.profileImageContainer}>
              <img
                src={defaultProfilePhoto}
                alt="Customer"
                className={styles.profileImageLarge}
              />
              <h2 className={styles.profileName}>
                {customerData?.name || "Loading..."}
              </h2>
              <p className={styles.memberSince}>
                Member since {new Date().getFullYear()}
              </p>
            </div>
            <div className={styles.contactDetails}>
              {!isEditMode ? (
                // Display Mode
                <>
                  <p>
                    <FaPhoneAlt className={styles.icon} />
                    <span>Phone</span>
                    <span className={styles.contactValue}>
                      {customerData?.phone || "N/A"}
                    </span>
                  </p>
                  <p>
                    <FaEnvelope className={styles.icon} />
                    <span>Email</span>
                    <span className={styles.contactValue}>
                      {customerData?.email || "N/A"}
                    </span>
                  </p>
                  <p>
                    <FaMapMarkerAlt className={styles.icon} />
                    <span>Address</span>
                    <span className={styles.contactValue}>
                      {customerData?.address || "N/A"}
                    </span>
                  </p>
                  <p>
                    <FaZipCode className={styles.icon} />
                    <span>Zip Code</span>
                    <span className={styles.contactValue}>
                      {customerData?.zipCode || "N/A"}
                    </span>
                  </p>
                  <p>
                    <FaCreditCard className={styles.icon} />
                    <span>Card ID</span>
                    <span className={styles.contactValue}>
                      {customerData?.cardId || "N/A"}
                    </span>
                  </p>
                </>
              ) : (
                // Edit Mode
                <form onSubmit={handleEditSubmit} className={styles.editForm}>
                  <div className={styles.editFormGroup}>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editFormData.name}
                      onChange={handleEditInputChange}
                      required
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.editFormGroup}>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditInputChange}
                      required
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.editFormGroup}>
                    <label htmlFor="email">Email:</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditInputChange}
                      required
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.editFormGroup}>
                    <label htmlFor="address">Address:</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditInputChange}
                      required
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.editFormGroup}>
                    <label htmlFor="zipCode">Zip Code:</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={editFormData.zipCode}
                      onChange={handleEditInputChange}
                      required
                      className={styles.editInput}
                    />
                  </div>
                  <div className={styles.editFormGroup}>
                    <label htmlFor="cardId">Card ID:</label>
                    <input
                      type="text"
                      id="cardId"
                      name="cardId"
                      value={editFormData.cardId || ""}
                      onChange={handleEditInputChange}
                      className={styles.editInput}
                    />
                  </div>

                  {editError && (
                    <div className={styles.editError}>{editError}</div>
                  )}

                  {editSuccess && (
                    <div className={styles.editSuccess}>
                      Profile updated successfully!
                    </div>
                  )}

                  <div className={styles.editFormButtons}>
                    <button
                      type="submit"
                      disabled={editLoading}
                      className={styles.editSaveButton}
                    >
                      {editLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={handleEditCancel}
                      className={styles.editCancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Stats Card */}
          <div className={styles.statsCard}>
            <div className={styles.profileCardHeader}>
              <h2 className={styles.sectionTitle}>Account Overview</h2>
            </div>
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <p className={styles.statValue}>{orders.length}</p>
                <p className={styles.statLabel}>Total Orders</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statValue}>
                  {
                    orders.filter(
                      (order) => order.orderStatus.toLowerCase() === "delivered"
                    ).length
                  }
                </p>
                <p className={styles.statLabel}>Completed</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statValue}>
                  $
                  {orders
                    .reduce((sum, order) => sum + order.TotalPrice, 0)
                    .toFixed(2)}
                </p>
                <p className={styles.statLabel}>Total Spent</p>
              </div>
              <div className={styles.statItem}>
                <p className={styles.statValue}>
                  {
                    orders.filter(
                      (order) => order.orderStatus.toLowerCase() === "pending"
                    ).length
                  }
                </p>
                <p className={styles.statLabel}>Pending Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Orders Section */}
        <div className={styles.ordersSection}>
          <div className={styles.ordersHeader}>
            <h2 className={styles.ordersTitle}>Your Orders</h2>
            <div className={styles.filterControls}>
              <button
                className={`${styles.filterButton} ${
                  activeFilter === "all" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter("all")}
              >
                All Orders
              </button>
              <button
                className={`${styles.filterButton} ${
                  activeFilter === "pending" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter("pending")}
              >
                Pending
              </button>
              <button
                className={`${styles.filterButton} ${
                  activeFilter === "processing" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter("processing")}
              >
                Processing
              </button>
              <button
                className={`${styles.filterButton} ${
                  activeFilter === "delivered" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter("delivered")}
              >
                Delivered
              </button>
              <button
                className={`${styles.filterButton} ${
                  activeFilter === "cancelled" ? styles.filterButtonActive : ""
                }`}
                onClick={() => setActiveFilter("cancelled")}
              >
                Cancelled
              </button>
            </div>
          </div>

          <div className={styles.ordersContainer}>
            {filteredOrders.length === 0 ? (
              <div className={styles.emptyOrders}>
                <FaReceipt size={40} color="#d1d5db" />
                <p className={styles.emptyOrdersText}>
                  No {activeFilter} orders found.
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <img
                      src={
                        order.restaurantImage &&
                        order.restaurantImage.length > 7
                          ? order.restaurantImage
                          : "https://t3.ftcdn.net/jpg/00/72/13/90/360_F_72139086_PgPSNJGHlbFSnhGeYn1NjhsbTHLbDFIT.jpg"
                      }
                      alt="Restaurant"
                      className={styles.restaurantImage}
                    />
                    <div className={styles.orderHeaderContent}>
                      <div className={styles.orderHeaderTop}>
                        <h3 className={styles.restaurantName}>
                          {order.restaurantName}
                        </h3>
                        <span
                          className={`${
                            styles.orderStatus
                          } ${getStatusClassName(order.orderStatus)}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className={styles.orderInfo}>
                        <div className={styles.orderInfoItem}>
                          <p className={styles.orderInfoLabel}>Order ID</p>
                          <p className={styles.orderInfoValue}>#{order.id}</p>
                        </div>
                        <div className={styles.orderInfoItem}>
                          <p className={styles.orderInfoLabel}>Date</p>
                          <p className={styles.orderInfoValue}>
                            {new Date(order.orderDate).toLocaleString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <div className={styles.orderInfoItem}>
                          <p className={styles.orderInfoLabel}>Payment</p>
                          <p className={styles.orderInfoValue}>
                            {order.paymentMethod}
                          </p>
                        </div>
                        {order.notes && (
                          <div className={styles.orderInfoItem}>
                            <p className={styles.orderInfoLabel}>Notes</p>
                            <p className={styles.orderInfoValue}>
                              {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <ul className={styles.orderItems}>
                    {order.orderItem.map((item) => (
                      <li key={item.id}>
                        <div className={styles.orderItemInfo}>
                          <span className={styles.quantityBadge}>
                            x{item.quantity}
                          </span>
                          <span>{item.foodItemName}</span>
                        </div>
                        <span className={styles.itemPrice}>
                          {item.quantity} x ${item.price}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className={styles.orderFooter}>
                    <div className={styles.totalSection}>
                      <span className={styles.totalLabel}>Total:</span>
                      <span className={styles.totalPrice}>
                        ${order.TotalPrice.toFixed(2)}
                      </span>
                    </div>
                    <div className={styles.orderActions}>
                      <button className={styles.actionButton}>
                        View Details
                      </button>
                      {order.orderStatus.toLowerCase() === "pending" && (
                        <button
                          className={styles.actionButton}
                          onClick={() => handleCancelClick(order.id)}
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.orderStatus.toLowerCase() === "delivered" && (
                        <button
                          className={`${styles.actionButton} ${styles.reviewButton}`}
                          onClick={() =>
                            openReviewModal(
                              Number(order.restaurantId),
                              order.restaurantName
                            )
                          }
                        >
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showCancelModal && (
        <div className={styles.reviewModalOverlay}>
          <div className={styles.cancelModal}>
            <button
              className={styles.modalCloseButton}
              onClick={closeCancelModal}
            >
              <FaTimes />
            </button>
            <h2 className={styles.modalTitle}>Cancel Order</h2>
            <p className={styles.modalBodyText}>
              Are you sure you want to cancel this order?
            </p>
            {cancelError && <p className={styles.reviewError}>{cancelError}</p>}
            {cancelSuccess && (
              <p className={styles.reviewSuccess}>{cancelSuccess}</p>
            )}
            <div className={styles.modalButtons}>
              <button
                className={styles.confirmButton}
                onClick={confirmCancelOrder}
              >
                Yes, Cancel
              </button>
              <button
                className={styles.cancelButton}
                onClick={closeCancelModal}
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className={styles.reviewModalOverlay}>
          <div className={styles.reviewModal}>
            <button
              className={styles.modalCloseButton}
              onClick={closeReviewModal}
            >
              <FaTimes />
            </button>
            <h2 className={styles.modalTitle}>
              Review {selectedRestaurant?.name}
            </h2>
            <form onSubmit={submitReview}>
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={styles.starIcon}
                    onClick={() => handleRatingChange(star)}
                  >
                    {reviewData.rating >= star ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
              <textarea
                className={styles.reviewTextarea}
                placeholder="Leave your comment here..."
                value={reviewData.comment}
                onChange={handleCommentChange}
              />
              {reviewError && (
                <p className={styles.reviewError}>{reviewError}</p>
              )}
              {reviewSuccess && (
                <p className={styles.reviewSuccess}>
                  Review submitted successfully!
                </p>
              )}
              <button
                type="submit"
                className={styles.submitReviewButton}
                disabled={reviewSubmitting}
              >
                {reviewSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditMode && customerData && (
        <div className={styles.editProfileOverlay}>
          <div className={styles.editProfileModal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Edit Profile</h2>
              <button
                className={styles.modalCloseButton}
                onClick={() => setIsEditMode(false)}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={styles.formInput}
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>
                    Phone
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className={styles.formInput}
                    value={editFormData.phone}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={styles.formInput}
                    value={editFormData.email}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address" className={styles.formLabel}>
                    Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    className={styles.formTextarea}
                    value={editFormData.address}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="zipCode" className={styles.formLabel}>
                    Zip Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className={styles.formInput}
                    value={editFormData.zipCode}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="cardId" className={styles.formLabel}>
                    Card ID
                  </label>
                  <input
                    type="text"
                    id="cardId"
                    name="cardId"
                    className={styles.formInput}
                    value={editFormData.cardId}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
              </div>
              {editError && <p className={styles.editError}>{editError}</p>}
              {editSuccess && (
                <p className={styles.editSuccess}>
                  Profile updated successfully!
                </p>
              )}
              <div className={styles.modalFooter}>
                <button
                  type="submit"
                  className={styles.saveButton}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer;
