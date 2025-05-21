import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../Admin.module.css";
import Loading from "../../../Common/Components/Loading/loading";
import { DashboardProps, DashboardStats } from "../types";
import { getAllManagers, getOrderCount, getCustomerCount } from "../services";

const Dashboard: React.FC<DashboardProps> = ({ restaurants, loading }) => {
  const navigate = useNavigate();
  const [managers, setManagers] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  // Initialize stats with real data where available
  const [stats, setStats] = useState<DashboardStats>({
    restaurants: restaurants.length,
    managers: 0,
    orders: 0,
    customers: 0,
  });

  useEffect(() => {
    setStats((prevStats) => ({
      ...prevStats,
      restaurants: restaurants.length,
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
        let ordersCount = await getOrderCount();

        // Fetch customer count directly
        let customersCount = await getCustomerCount();

        // Update stats with real data from APIs
        setStats({
          restaurants: restaurants.length,
          managers: managersData.length,
          orders: ordersCount,
          customers: customersCount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setStats((prevStats) => ({
          ...prevStats,
          managers: managers.length,
          orders: 0,
          customers: 0,
        }));
      } finally {
        setDashboardLoading(false);
      }
    };
    fetchData();
  }, [restaurants.length]);

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

            <div className={styles.actionIcon}>🍽️</div>

            <h3 className={styles.actionTitle}>Add New Restaurant</h3>
            <p className={styles.actionDescription}>
              Create a new restaurant profile with details.
            </p>
            <button
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation("/admin-profile/restaurants")}
            >
              Add Restaurant
            </button>
          </div>

          <div className={styles.actionCard}>

            <div className={styles.actionIcon}>👤</div>

            <h3 className={styles.actionTitle}>Add New Manager</h3>
            <p className={styles.actionDescription}>
              Register a new restaurant manager.
            </p>
            <button
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation("/admin-profile/managers")}
            >
              Add Manager
            </button>
          </div>

          <div className={styles.actionCard}>

            <div className={styles.actionIcon}>📋</div>

            <h3 className={styles.actionTitle}>View Restaurants</h3>
            <p className={styles.actionDescription}>
              Manage existing restaurant profiles.
            </p>
            <button
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation("/admin-profile/restaurants")}
            >
              View Restaurants
            </button>
          </div>

          <div className={styles.actionCard}>

            <div className={styles.actionIcon}>👥</div>

            <h3 className={styles.actionTitle}>View Managers</h3>
            <p className={styles.actionDescription}>
              Manage existing restaurant managers.
            </p>
            <button
              className={`${styles.actionButton} ${styles.primaryButton}`}
              onClick={() => handleNavigation("/admin-profile/managers")}
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
