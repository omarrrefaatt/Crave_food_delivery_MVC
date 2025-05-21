import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Admin.module.css';
import RestaurantManagement from './components/RestaurantManagement';
import ManagerManagement from './components/ManagerManagement';
import Dashboard from './components/Dashboard';
import { useAuthContext } from '../../Common/Contexts/Auth/AuthHook';
import { getAllRestaurants } from './services';
import { Restaurant } from './types';

const AdminPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'restaurants' | 'managers'>('dashboard');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const { user, dispatch } = useAuthContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Set active view based on URL path
    const path = location.pathname.split('/').pop();
    if (path === 'restaurants') {
      setActiveView('restaurants');
    } else if (path === 'managers') {
      setActiveView('managers');
    } else {
      setActiveView('dashboard');
    }

    // Fetch restaurants for stats
    const fetchRestaurants = async () => {
      try {
        const data = await getAllRestaurants();
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [location.pathname]);

  // Check if user is authenticated and has admin role
  if (!user || user.role !== 'admin') {
    return (
      <div className={styles.adminContainer}>
        <h2>Unauthorized Access</h2>
        <p>You must be logged in as an admin to view this page.</p>
      </div>
    );
  }

  const handleNavigation = (view: 'dashboard' | 'restaurants' | 'managers') => {
    setActiveView(view);
    if (view === 'dashboard') {
      navigate('/admin-profile');
    } else {
      navigate(`/admin-profile/${view}`);
    }
  };

  const handleSignOut = () => {
    // Remove user data from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Dispatch logout action
    dispatch({ type: 'LOGOUT' });
    
    // Redirect to login page
    navigate('/login');
  };


  return (
    <div>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.topBarTitle}>Crave Admin</div>

        <div className={styles.signOutButton} onClick={handleSignOut}>
          <span className={styles.signOutIcon}>🚪</span>
          Sign Out
        </div>

      </div>

      {/* Sidebar */}
      <div className={styles.sidebarContainer}>
        <div 
          className={`${styles.navItem} ${activeView === 'dashboard' ? styles.navItemActive : ''}`}
          onClick={() => handleNavigation('dashboard')}
        >
          <span className={styles.navIcon}>📊</span>
          Dashboard
        </div>
        <div 
          className={`${styles.navItem} ${activeView === 'restaurants' ? styles.navItemActive : ''}`}
          onClick={() => handleNavigation('restaurants')}
        >
          <span className={styles.navIcon}>🍽️</span>
          Restaurants
        </div>
        <div 
          className={`${styles.navItem} ${activeView === 'managers' ? styles.navItemActive : ''}`}
          onClick={() => handleNavigation('managers')}
        >
          <span className={styles.navIcon}>👤</span>
          Managers
        </div>

        <div className={styles.sidebarFooter}>
          <div className={styles.navItem} onClick={handleSignOut}>
            <span className={styles.navIcon}>🚪</span>
            Sign Out
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {activeView === 'dashboard' && <Dashboard restaurants={restaurants} loading={loading} />}
        {activeView === 'restaurants' && <RestaurantManagement />}
        {activeView === 'managers' && <ManagerManagement />}
      </div>
    </div>
  );
};

export default AdminPage;
