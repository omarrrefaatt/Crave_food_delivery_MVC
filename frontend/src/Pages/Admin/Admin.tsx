import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Admin.module.css";
import RestaurantManagement from "./components/RestaurantManagement";
import ManagerManagement from "./components/ManagerManagement";
import Dashboard from "./components/Dashboard";
import { useAuthContext } from "../../Common/Contexts/Auth/AuthHook";
import { getAllRestaurants } from "./services";
import { Restaurant } from "./types";

const AdminPage: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "dashboard" | "restaurants" | "managers"
  >("dashboard");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname.split("/").pop();
    if (path === "restaurants") {
      setActiveView("restaurants");
    } else if (path === "managers") {
      setActiveView("managers");
    } else {
      setActiveView("dashboard");
    }

    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error("Failed to fetch restaurants:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location.pathname]);

  if (!user || user.role !== "admin") {
    return (
      <div className={styles.adminContainer}>
        <h2>Access Denied</h2>
        <p>You must be an admin to access this page.</p>
      </div>
    );
  }

  const handleNavigation = (view: "dashboard" | "restaurants" | "managers") => {
    setActiveView(view);
    const route =
      view === "dashboard" ? "/admin-profile" : `/admin-profile/${view}`;
    navigate(route);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  return (
    <div className={styles.adminPage}>
      {/* Top Bar */}
      <header className={styles.topBar}>
        <div className={styles.brand}>Crave Admin Panel</div>
        <button className={styles.logoutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        <nav>
          <div
            className={`${styles.navItem} ${
              activeView === "dashboard" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("dashboard")}
          >
            Dashboard
          </div>
          <div
            className={`${styles.navItem} ${
              activeView === "restaurants" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("restaurants")}
          >
            Restaurants
          </div>
          <div
            className={`${styles.navItem} ${
              activeView === "managers" ? styles.active : ""
            }`}
            onClick={() => handleNavigation("managers")}
          >
            Managers
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className={styles.mainContent}>
        {activeView === "dashboard" && (
          <Dashboard restaurants={restaurants} loading={loading} />
        )}
        {activeView === "restaurants" && <RestaurantManagement />}
        {activeView === "managers" && <ManagerManagement />}
      </main>
    </div>
  );
};

export default AdminPage;
