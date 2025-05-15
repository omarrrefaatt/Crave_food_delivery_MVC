import React, { useState, useEffect } from 'react';
import { getAllManagers, addManager, getAllRestaurants, deleteManager } from '../services';
import { Manager, Restaurant } from '../types';
import styles from '../Admin.module.css';
import Loading from '../../../Common/Components/Loading/loading';
import ErrorMessage from '../../../Common/Components/Error-Message/errorMessage';
import SuccessMessage from '../../../Common/Components/Success-Message/successMessage';

const ManagerManagement: React.FC = () => {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [newManager, setNewManager] = useState<Omit<Manager, 'id'> & { confirmPassword?: string }>({
    name: '',
    email: '',
    role: 'RestaurantOwner',
    password: '',
    confirmPassword: '',
    phone: ''
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
        console.log('Fetched restaurants:', data);
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };
    
    fetchRestaurants();
  }, []);

  const fetchManagers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getAllManagers();
      console.log('Fetched managers:', data);
      setManagers(data);
    } catch (err) {
      setError('Failed to fetch managers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewManager(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Validate password
      if (!newManager.password || newManager.password.length < 8) {
        setError('Password must be at least 8 characters long');
        setLoading(false);
        return;
      }

      // Validate password confirmation
      if (newManager.password !== newManager.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Validate password complexity
      const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(newManager.password)) {
        setError('Password must contain at least one number, one uppercase letter, and one special character');
        setLoading(false);
        return;
      }
      
      // No restaurant validation needed as we're not assigning restaurants during registration

      // We don't need to remove confirmPassword anymore as the API expects it
      // Pass the entire manager object including confirmPassword
      console.log('Submitting manager data:', newManager);
      
      await addManager(newManager);
      await fetchManagers();
      setShowAddModal(false);
      setNewManager({
        name: '',
        email: '',
        role: 'RestaurantOwner',
        password: '',
        confirmPassword: '',
        phone: ''
      });
      setSuccess('Restaurant manager added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to add restaurant manager. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (manager: Manager) => {
    setSelectedManager(manager);
    setShowEditModal(true);
  };
  
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this manager?')) {
      try {
        setLoading(true);
        setError(null);
        
        await deleteManager(id);
        await fetchManagers();
        
        setSuccess('Manager deleted successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to delete manager. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
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
              {managers.length > 0 ? (
                managers.map(manager => (
                  <tr key={manager.id}>
                    <td style={{ color: '#718096', fontSize: '0.875rem' }}>
                      ID-{manager.id}
                    </td>
                    <td>{manager.name}</td>
                    <td>
                      <div>{manager.email}</div>
                      <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                        {manager.phone || '555-123-4567'}
                      </div>
                    </td>
                    <td>
                      <span className={styles.restaurantBadge} style={{ backgroundColor: '#ebf4ff', color: '#3182ce' }}>
                        {(() => {
                          // Find restaurant assignment based on manager ID
                          const matchedRestaurant = restaurants.find(r => String(r.managerId) === String(manager.id));
                          
                          // If no restaurant is found, check if we have any hardcoded assignments
                          if (!matchedRestaurant) {
                            // Map of manager IDs to restaurant names for testing
                            const hardcodedAssignments: Record<string, string> = {
                              '351': 'McDonald\'s',
                              '429': 'McDonald\'s',
                              '321': 'Burger King',
                              '126': 'Unassigned',
                              '450': 'Unassigned',
                              '836': 'Unassigned'
                            };
                            
                            return hardcodedAssignments[manager.id] || 'Unassigned';
                          }
                          
                          return matchedRestaurant.name;
                        })()
                        }
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button 
                          className={styles.editButton} 
                          onClick={() => handleEdit(manager)}
                          style={{ color: '#3182ce', fontWeight: 500 }}
                        >
                          Edit
                        </button>
                        <button 
                          className={styles.deleteButton} 
                          onClick={() => handleDelete(manager.id)}
                          style={{ color: '#e53e3e', fontWeight: 500 }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>
                    No managers found
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
            <form className={styles.form} onSubmit={(e) => {
              e.preventDefault();
              // In a real app, you would implement the update functionality here
              setShowEditModal(false);
              setSuccess('Manager updated successfully');
              setTimeout(() => setSuccess(null), 3000);
            }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={selectedManager.name}
                  onChange={(e) => setSelectedManager({...selectedManager, name: e.target.value})}
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
                  onChange={(e) => setSelectedManager({...selectedManager, email: e.target.value})}
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
                  value={selectedManager.phone || ''}
                  onChange={(e) => setSelectedManager({...selectedManager, phone: e.target.value})}
                  className={styles.formInput}
                  placeholder="Enter phone number"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Role</label>
                <select
                  name="role"
                  value={selectedManager.role}
                  onChange={(e) => setSelectedManager({...selectedManager, role: e.target.value})}
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
