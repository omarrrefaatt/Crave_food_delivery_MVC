import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../Admin.module.css';
import Loading from '../../../Common/Components/Loading/loading';
import { Restaurant } from '../types';
import { getAllManagers } from '../services';

interface DashboardProps {
  restaurants: Restaurant[];
  loading: boolean;
}

interface DashboardStats {
  restaurants: number;
  managers: number;
  orders: number;
  customers: number;
}

const Dashboard: React.FC<DashboardProps> = ({ restaurants, loading }) => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  
  // Initialize stats with real data where available
  const [stats, setStats] = useState<DashboardStats>({
    restaurants: restaurants.length,
    managers: 0,
    orders: 0,
    customers: 0
  });
  
  useEffect(() => {
    // Update restaurant count when restaurants prop changes
    setStats(prevStats => ({
      ...prevStats,
      restaurants: restaurants.length
    }));
  }, [restaurants]);
  
  useEffect(() => {
    const fetchData = async () => {
      setDashboardLoading(true);
      try {
        // Fetch managers data
        const managersData = await getAllManagers();
        setManagers(managersData);
        
        // Fetch order count directly
        let ordersCount = 0;
        try {
          const orderResponse = await fetch('http://localhost:5231/api/Order/count', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : ''}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (orderResponse.ok) {
            const orderData = await orderResponse.json();
            console.log('Order data:', orderData);
            ordersCount = orderData.count || 0;
          }
        } catch (orderError) {
          console.error('Error fetching order count:', orderError);
        }
        
        // Fetch customer count directly
        let customersCount = 0;
        try {
          const customerResponse = await fetch('http://localhost:5231/api/Users/count', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') ? JSON.parse(localStorage.getItem('token') || '') : ''}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (customerResponse.ok) {
            const customerData = await customerResponse.json();
            console.log('Customer data:', customerData);
            customersCount = customerData.count || 0;
          }
        } catch (customerError) {
          console.error('Error fetching customer count:', customerError);
        }
        
        // Update stats with real data from APIs
        setStats({
          restaurants: restaurants.length,
          managers: managersData.length,
          orders: ordersCount,
          customers: customersCount
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        
        // If API calls fail, set default values
        setStats(prevStats => ({
          ...prevStats,
          managers: managers.length,
          orders: 0,
          customers: 0
        }));
      } finally {
        setDashboardLoading(false);
      }
    };
    
    fetchData();
  }, [restaurants.length]); // Re-fetch when restaurant count changes

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (loading || dashboardLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.restaurants}</div>
            <div className={styles.statLabel}>Restaurants</div>
          </div>
          <div className={styles.statIcon}>🍽️</div>
        </div>
        
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.managers}</div>
            <div className={styles.statLabel}>Managers</div>
          </div>
          <div className={styles.statIcon}>👤</div>
        </div>
        
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.orders}</div>
            <div className={styles.statLabel}>Orders</div>
          </div>
          <div className={styles.statIcon}>📋</div>
        </div>
        
        <div className={styles.statCard}>
          <div>
            <div className={styles.statValue}>{stats.customers}</div>
            <div className={styles.statLabel}>Customers</div>
          </div>
          <div className={styles.statIcon}>👥</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className={styles.quickActionsContainer}>
        <h2 className={styles.quickActionsTitle}>Quick Actions</h2>
        
        <div className={styles.quickActionsGrid}>
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>Add New Restaurant</h3>
            <p className={styles.actionDescription}>Create a new restaurant profile with details.</p>
            <button 
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation('/admin-profile/restaurants')}
            >
              Add Restaurant
            </button>
          </div>
          
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>Add New Manager</h3>
            <p className={styles.actionDescription}>Register a new restaurant manager.</p>
            <button 
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation('/admin-profile/managers')}
            >
              Add Manager
            </button>
          </div>
          
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>View Restaurants</h3>
            <p className={styles.actionDescription}>Manage existing restaurant profiles.</p>
            <button 
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation('/admin-profile/restaurants')}
            >
              View Restaurants
            </button>
          </div>
          
          <div className={styles.actionCard}>
            <h3 className={styles.actionTitle}>View Managers</h3>
            <p className={styles.actionDescription}>Manage existing restaurant managers.</p>
            <button 
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation('/admin-profile/managers')}
            >
              View Managers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
