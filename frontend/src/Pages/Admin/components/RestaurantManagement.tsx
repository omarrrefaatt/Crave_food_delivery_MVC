import React, { useState, useEffect } from "react";
import {
  getAllRestaurants,
  deleteRestaurant,
  getAllManagers,
} from "../services";
import { Restaurant, Manager } from "../types";
import styles from "../Admin.module.css";
import Loading from "../../../Common/Components/Loading/loading";
import ErrorMessage from "../../../Common/Components/Error-Message/errorMessage";
import SuccessMessage from "../../../Common/Components/Success-Message/successMessage";

const RestaurantManagement: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState<Omit<Restaurant, "id">>({
    name: "",
    location: "",
    description: "",
    category: "",
    managerId: "",
    contactInfo: "",
    operatingHours: "",
    imageUrl: "",
  });

  useEffect(() => {
    fetchRestaurants();
    fetchManagers();
  }, []);

  // Fetch restaurant managers (users with RestaurantOwner role)
  const fetchManagers = async () => {
    try {
      setLoading(true);
      const data = await getAllManagers();
      console.log("Available managers:", data);

      if (data && data.length > 0) {
        setManagers(data);
      } else {
        console.warn("No managers found or empty managers array returned");
        setError(
          "No restaurant managers available. Please add managers first."
        );
      }
    } catch (error) {
      console.error("Error fetching managers:", error);
      setError("Failed to load restaurant managers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllRestaurants();
      setRestaurants(data);
    } catch (err) {
      setError("Failed to fetch restaurants. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        setLoading(true);
        await deleteRestaurant(id);
        setRestaurants(
          restaurants.filter((restaurant) => restaurant.id !== id)
        );
        setSuccess("Restaurant deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete restaurant. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    console.log(`Input changed: ${name} = ${value}`);
    setNewRestaurant((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("Updated restaurant state:", updated);
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      const tokenData = localStorage.getItem("token");
      if (!tokenData) {
        console.error("No token found in localStorage");
        setError("Authentication token not found. Please log in again.");
        return;
      }

      const token = JSON.parse(tokenData);

      const {
        name = "",
        location = "",
        description = "",
        category = "",
        contactInfo = "",
        operatingHours = "",
        imageUrl = "",
        managerId,
      } = newRestaurant;

      const restaurantToAdd = {
        name,
        location,
        description,
        category,
        contactInfo,
        operatingHours,
        imageUrl,
        userId: managerId,
        rating: 0,
        avgDeliveryTime: 30,
      };

      // Log manager info for UI tracking
      if (managerId) {
        const selectedManager = managers.find((m) => m.userId === managerId);
        console.log("Selected manager:", selectedManager);
      } else {
        console.log(
          "No manager selected — backend will use the authenticated user."
        );
      }

      const response = await fetch("http://localhost:5231/api/Restaurant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(restaurantToAdd),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          errorText || `Request failed with status ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Restaurant added successfully:", data);

      await fetchRestaurants();

      setShowAddModal(false);
      setNewRestaurant({
        name: "",
        location: "",
        description: "",
        category: "",
        managerId: "",
        contactInfo: "",
        operatingHours: "",
        imageUrl: "",
      });

      setSuccess("Restaurant added successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      console.error("Error adding restaurant:", err);
      setError(err.message || "Failed to add restaurant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Fast food': 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
      'Grills': 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
      'Asian': 'linear-gradient(135deg, #4CAF50 0%, #388E3C 100%)',
      'Japanese': 'linear-gradient(135deg, #E91E63 0%, #C2185B 100%)',
      'string': 'linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)',
    };
    
    // Normalize the category for case-insensitive matching
    const normalizedCategory = category.toLowerCase();
    
    // Find a matching category (partial match)
    const matchedCategory = Object.keys(categoryMap).find(key => 
      normalizedCategory.includes(key.toLowerCase())
    );
    
    return matchedCategory ? categoryMap[matchedCategory] : 'linear-gradient(135deg, #a70000 0%, #d32f2f 100%)';
  };

  const getCategoryBgColor = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Fast food': '#FFF3E0',
      'Grills': '#FFEBEE',
      'Asian': '#E8F5E9',
      'Japanese': '#FCE4EC',
      'string': '#F3E5F5',
    };
    
    const normalizedCategory = category.toLowerCase();
    const matchedCategory = Object.keys(categoryMap).find(key => 
      normalizedCategory.includes(key.toLowerCase())
    );
    
    return matchedCategory ? categoryMap[matchedCategory] : '#ebf4ff';
  };

  const getCategoryTextColor = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'Fast food': '#E65100',
      'Grills': '#C62828',
      'Asian': '#2E7D32',
      'Japanese': '#AD1457',
      'string': '#6A1B9A',
    };
    
    const normalizedCategory = category.toLowerCase();
    const matchedCategory = Object.keys(categoryMap).find(key => 
      normalizedCategory.includes(key.toLowerCase())
    );
    
    return matchedCategory ? categoryMap[matchedCategory] : '#3182ce';
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Restaurant Management</h2>

        <button
          className={`${styles.actionButton} ${styles.primaryButton}`}
          onClick={() => setShowAddModal(true)}
        >
          Add New Restaurant
        </button>
      </div>

      {error && <ErrorMessage text={error} isVisible={!!error} />}
      {success && <SuccessMessage text={success} isVisible={!!success} />}

      {loading && !showAddModal ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.length > 0 ? (
                restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>

                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.avatarCircle} style={{ background: getCategoryColor(restaurant.category) }}>
                          {restaurant.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{restaurant.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.locationCell}>
                        <span className={styles.contactIcon}>📍</span>
                        {restaurant.location}
                      </div>
                    </td>
                    <td>
                      <span 
                        className={styles.restaurantBadge}
                        style={{ 
                          backgroundColor: getCategoryBgColor(restaurant.category),
                          color: getCategoryTextColor(restaurant.category)
                        }}
                      >
                        {restaurant.category}
                      </span>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div className={styles.phoneNumber}>
                          <span className={styles.contactIcon}>📞</span>
                          {restaurant.contactInfo || "Not provided"}
                        </div>
                        <div className={styles.operatingHours}>
                          <span className={styles.contactIcon}>🕒</span>
                          {restaurant.operatingHours || "Not specified"}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionButtons}>

                        <button className={styles.editButton}>Edit</button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(restaurant.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
t
                  <td colSpan={5} className={styles.emptyTableMessage}>
                    <div className={styles.noDataContainer}>
                      <div className={styles.noDataIcon}>🍽️</div>
                      <p>No restaurants found</p>
                      <button 
                        className={`${styles.actionButton} ${styles.primaryButton}`}
                        onClick={() => setShowAddModal(true)}
                      >
                        Add Your First Restaurant
                      </button>
                    </div>

                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Restaurant</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Name</label>
                <input
                  type="text"
                  name="name"
                  value={newRestaurant.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={newRestaurant.location}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Description</label>
                <textarea
                  name="description"
                  value={newRestaurant.description}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Category</label>
                <input
                  type="text"
                  name="category"
                  value={newRestaurant.category}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Restaurant Manager</label>
                <select
                  name="managerId"
                  value={newRestaurant.managerId}
                  onChange={(e) => {
                    console.log("Manager selected:", e.target.value);
                    handleInputChange(e);
                  }}
                  className={styles.formInput}
                  required
                >
                  <option value="">Select a Restaurant Manager</option>
                  {managers && managers.length > 0 ? (
                    managers
                      .filter(
                        (manager) =>
                          !restaurants.some(
                            (restaurant) =>
                              restaurant.managerId === manager.userId
                          )
                      )
                      .map((manager) => (
                        <option key={manager.userId} value={manager.userId}>
                          {manager.name} ({manager.email})
                        </option>
                      ))
                  ) : (
                    <option value="" disabled>
                      No managers available - add managers first
                    </option>
                  )}
                </select>
                {newRestaurant.managerId && (
                  <div style={{ color: "green", marginTop: "4px" }}>
                    ✓ Manager selected:{" "}
                    {managers.find((m) => m.userId === newRestaurant.managerId)
                      ?.name || "Unknown"}
                  </div>
                )}
                <small
                  style={{
                    color: "#718096",
                    display: "block",
                    marginTop: "4px",
                  }}
                >
                  {managers && managers.length > 0
                    ? "Select a user with the Restaurant Owner role"
                    : "Please add restaurant managers in the Managers section first"}
                </small>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Contact Info</label>
                <input
                  type="text"
                  name="contactInfo"
                  value={newRestaurant.contactInfo}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Operating Hours</label>
                <input
                  type="text"
                  name="operatingHours"
                  value={newRestaurant.operatingHours}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={newRestaurant.imageUrl}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.secondaryButton}`}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.actionButton} ${styles.primaryButton}`}
                >
                  Add Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagement;
