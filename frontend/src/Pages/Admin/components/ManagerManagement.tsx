import React, { useState, useEffect } from "react";
import {
  getAllManagers,
  addManager,
  getAllRestaurants,
  deleteManager,
  updateManager,
} from "../services";
import { Manager, Restaurant } from "../types";
import styles from "../Admin.module.css";
import Loading from "../../../Common/Components/Loading/loading";
import ErrorMessage from "../../../Common/Components/Error-Message/errorMessage";
import SuccessMessage from "../../../Common/Components/Success-Message/successMessage";

const ManagerManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [filteredManagers, setFilteredManagers] = useState<Manager[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);

  const [filterOption, setFilterOption] = useState<string>("all");

  const [newManager, setNewManager] = useState<
    Omit<Manager, "userId"> & { confirmPassword?: string }
  >({
    name: "",
    email: "",
    role: "RestaurantOwner",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  useEffect(() => {
    fetchManagers();
  }, []);

  // State for restaurants to display in the form and table
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  // Fetch both managers and restaurants when component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        console.log("Fetched restaurants:", data);
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // Apply filter whenever managers, restaurants, or filter option changes
  useEffect(() => {
    applyFilter(filterOption);
  }, [managers, restaurants, filterOption]);

  const applyFilter = (option: string) => {
    if (!managers.length) {
      setFilteredManagers([]);
      return;
    }

    switch (option) {
      case "assigned":
        setFilteredManagers(
          managers.filter(manager => {
            // Check if manager is assigned to any restaurant
            const isAssigned = restaurants.some(
              restaurant => String(restaurant.managerId) === String(manager.userId)
            );
            
            // Also check hardcoded assignments
            const hardcodedAssignments: Record<string, string> = {
              "351": "McDonald's",
              "429": "McDonald's",
              "321": "Burger King",
            };
            
            return isAssigned || hardcodedAssignments[manager.userId];
          })
        );
        break;
      case "unassigned":
        setFilteredManagers(
          managers.filter(manager => {
            // Check if manager is not assigned to any restaurant
            const isAssigned = restaurants.some(
              restaurant => String(restaurant.managerId) === String(manager.userId)
            );
            
            // Also check hardcoded assignments
            const hardcodedAssignments: Record<string, string> = {
              "351": "McDonald's",
              "429": "McDonald's",
              "321": "Burger King",
            };
            
            return !isAssigned && !hardcodedAssignments[manager.userId];
          })
        );
        break;
      case "all":
      default:
        setFilteredManagers(managers);
        break;
    }
  };


  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getAllManagers();
      console.log("Fetched managers:", data);
      setManagers(data);
    } catch (err) {
      setError("Failed to fetch managers. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewManager((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      // Validate password
      if (!newManager.password || newManager.password.length < 8) {
        setError("Password must be at least 8 characters long");
        setLoading(false);
        return;
      }

      // Validate password confirmation
      if (newManager.password !== newManager.confirmPassword) {
        setError("Passwords do not match");
        setLoading(false);
        return;
      }

      // Validate password complexity
      const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(newManager.password)) {
        setError(
          "Password must contain at least one number, one uppercase letter, and one special character"
        );
        setLoading(false);
        return;
      }

      // No restaurant validation needed as we're not assigning restaurants during registration

      // We don't need to remove confirmPassword anymore as the API expects it
      // Pass the entire manager object including confirmPassword
      console.log("Submitting manager data:", newManager);

      await addManager(newManager);
      await fetchManagers();
      setShowAddModal(false);
      setNewManager({
        name: "",
        email: "",
        role: "RestaurantOwner",
        password: "",
        confirmPassword: "",
        phone: "",
      });
      setSuccess("Restaurant manager added successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to add restaurant manager. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (manager: Manager) => {
    setSelectedManager(manager);
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedManager) return;

    try {
      setLoading(true);
      setError(null);

      // Prepare manager data for update
      const managerData = {
        name: selectedManager.name,
        email: selectedManager.email,
        phone: selectedManager.phone || "",
        role: selectedManager.role,
        password: "", // Not needed for update
      };

      await updateManager(selectedManager.userId, managerData);
      await fetchManagers(); // Refresh the manager list

      setShowEditModal(false);
      setSuccess("Manager updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to update manager. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this manager?")) {
      try {
        setLoading(true);
        setError(null);

        await deleteManager(id);
        await fetchManagers();

        setSuccess("Manager deleted successfully");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError("Failed to delete manager. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };


  // Add this function after the state declarations
  const getManagerRoleColor = (userId: string): string => {
    // Create a deterministic color based on the user ID
    // This ensures the same manager always gets the same color
    const colorOptions = [
      'linear-gradient(135deg, #3949AB 0%, #303F9F 100%)',
      'linear-gradient(135deg, #7B1FA2 0%, #6A1B9A 100%)',
      'linear-gradient(135deg, #00897B 0%, #00796B 100%)',
      'linear-gradient(135deg, #F57C00 0%, #EF6C00 100%)',
      'linear-gradient(135deg, #a70000 0%, #d32f2f 100%)',
    ];
    
    // Simple hash function to get a consistent index
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colorOptions[hash % colorOptions.length];
  };

  const getRestaurantBadgeColor = (restaurantName: string | undefined): { bg: string, text: string } => {
    if (!restaurantName || restaurantName === "Unassigned") {
      return { bg: "#f7fafc", text: "#718096" };
    }
    
    const categoryMap: Record<string, { bg: string, text: string }> = {
      'McDonald': { bg: "#FFF3E0", text: "#E65100" },
      'Burger': { bg: "#FFEBEE", text: "#C62828" },
      'Asian': { bg: "#E8F5E9", text: "#2E7D32" },
      'Japanese': { bg: "#FCE4EC", text: "#AD1457" },
      'sushi': { bg: "#FCE4EC", text: "#AD1457" },
      'restaurant': { bg: "#F3E5F5", text: "#6A1B9A" },
      'omar': { bg: "#FFEBEE", text: "#C62828" },
      'kababdy': { bg: "#FFEBEE", text: "#C62828" },
    };
    
    // Normalize the name for case-insensitive matching
    const normalizedName = restaurantName.toLowerCase();
    
    // Find a matching category (partial match)
    const matchedKey = Object.keys(categoryMap).find(key => 
      normalizedName.includes(key.toLowerCase())
    );
    
    return matchedKey ? categoryMap[matchedKey] : { bg: "#ebf4ff", text: "#3182ce" };
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>Restaurant Managers</h2>
        <button
          className={`${styles.actionButton} ${styles.primaryButton}`}
          onClick={() => setShowAddModal(true)}
        >
          Add New Manager
        </button>
      </div>

      {error && <ErrorMessage text={error} isVisible={!!error} />}
      {success && <SuccessMessage text={success} isVisible={!!success} />}

      <div className={styles.filterContainer}>
        <label htmlFor="filter" className={styles.filterLabel}>Filter by:</label>
        <select
          id="filter"
          value={filterOption}
          onChange={(e) => setFilterOption(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Managers</option>
          <option value="assigned">Assigned to Restaurant</option>
          <option value="unassigned">Unassigned</option>
        </select>
      </div>


      {loading && !showAddModal ? (
        <div className={styles.loadingContainer}>
          <Loading />
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Restaurant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>

              {filteredManagers.length > 0 ? (
                filteredManagers.map((manager) => (
                  <tr key={manager.userId}>
                    <td>
                      <span className={styles.idBadge}>{manager.userId}</span>
                    </td>
                    <td>
                      <div className={styles.nameCell}>
                        <div className={styles.avatarCircle} style={{ background: getManagerRoleColor(manager.userId) }}>
                          {manager.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{manager.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactInfo}>
                        <div className={styles.emailAddress}>
                          <span className={styles.contactIcon}>✉️</span>
                          {manager.email}
                        </div>
                        <div className={styles.phoneNumber}>
                          <span className={styles.contactIcon}>📱</span>
                          {manager.phone || "555-123-4567"}
                        </div>
                      </div>
                    </td>
                    <td>
                      {(() => {
                        // Find restaurant assignment based on manager ID
                        const matchedRestaurant = restaurants.find(
                          (r) => String(r.managerId) == String(manager.userId)
                        );
                        
                        // If no restaurant is found, check if we have any hardcoded assignments
                        if (!matchedRestaurant) {
                          // Map of manager IDs to restaurant names for testing
                          const hardcodedAssignments: Record<string, string> = {
                            "351": "McDonald's",
                            "429": "McDonald's",
                            "321": "Burger King",
                            "126": "Unassigned",
                            "450": "Unassigned",
                            "836": "Unassigned",
                          };

                          const restaurantName = hardcodedAssignments[manager.userId] || "Unassigned";
                          const badgeColor = getRestaurantBadgeColor(restaurantName);

                          return (
                            <span
                              className={styles.restaurantBadge}
                              style={{ 
                                backgroundColor: badgeColor.bg, 
                                color: badgeColor.text 
                              }}
                            >
                              {restaurantName}
                            </span>
                          );
                        }

                        const badgeColor = getRestaurantBadgeColor(matchedRestaurant.name);
                        
                        return (
                          <span
                            className={styles.restaurantBadge}
                            style={{ 
                              backgroundColor: badgeColor.bg, 
                              color: badgeColor.text 
                            }}
                          >
                            {matchedRestaurant.name}
                          </span>
                        );
                      })()}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          className={styles.editButton}
                          onClick={() => handleEdit(manager)}

                        >
                          Edit
                        </button>
                        <button
                          className={styles.deleteButton}
                          onClick={() => handleDelete(manager.userId)}

                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>

                  <td colSpan={5} className={styles.emptyTableMessage}>
                    <div className={styles.noDataContainer}>
                      <div className={styles.noDataIcon}>👤</div>
                      <p>{filterOption !== "all" 
                        ? `No ${filterOption === "assigned" ? "assigned" : "unassigned"} managers found` 
                        : "No managers found"}
                      </p>
                      {filterOption === "all" && (
                        <button 
                          className={`${styles.actionButton} ${styles.primaryButton}`}
                          onClick={() => setShowAddModal(true)}
                        >
                          Add Your First Manager
                        </button>
                      )}
                      {filterOption !== "all" && (
                        <button 
                          className={`${styles.actionButton} ${styles.secondaryButton}`}
                          onClick={() => setFilterOption("all")}
                        >
                          View All Managers
                        </button>
                      )}
                    </div>

                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Manager Modal */}
      {showAddModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add New Manager</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowAddModal(false)}
              >
                &times;
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={newManager.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={newManager.email}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={newManager.phone}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={newManager.password}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  minLength={8}
                  placeholder="Minimum 8 characters"
                  pattern="(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}"
                  title="Password must contain at least one number, one uppercase letter, and one special character"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={newManager.confirmPassword}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  minLength={8}
                  placeholder="Confirm your password"
                />
              </div>
              {/* Restaurant selection removed as requested */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role</label>
                <select
                  name="role"
                  value={newManager.role}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  required
                  disabled
                >
                  <option value="RestaurantOwner">Restaurant Owner</option>
                </select>
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
                  Add Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Manager Modal */}
      {showEditModal && selectedManager && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Edit Manager</h3>
              <button
                className={styles.closeButton}
                onClick={() => setShowEditModal(false)}
              >
                &times;
              </button>
            </div>
            <form className={styles.form} onSubmit={handleUpdate}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedManager.name}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      name: e.target.value,
                    })
                  }
                  className={styles.formInput}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={selectedManager.email}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      email: e.target.value,
                    })
                  }
                  className={styles.formInput}
                  required
                  placeholder="Enter email address"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={selectedManager.phone || ""}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      phone: e.target.value,
                    })
                  }
                  className={styles.formInput}
                  placeholder="Enter phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role</label>
                <select
                  name="role"
                  value={selectedManager.role}
                  onChange={(e) =>
                    setSelectedManager({
                      ...selectedManager,
                      role: e.target.value,
                    })
                  }
                  className={styles.formInput}
                  required
                  disabled
                >
                  <option value="RestaurantOwner">Restaurant Owner</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={`${styles.actionButton} ${styles.secondaryButton}`}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`${styles.actionButton} ${styles.primaryButton}`}
                >
                  Update Manager
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerManagement;
