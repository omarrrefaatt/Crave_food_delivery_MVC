import HomePage from "../Pages/Home/homePage";
import ContactPage from "../Pages/Contact/contactPage";
import DoctorsPage from "../Pages/Restaurants/restaurantsPage";
import LoginPage from "../Pages/Login/loginPage";
import RegisterPage from "../Pages/Register/registerPage";
import ProtectedRoute from "./routeProtection";
import Customer from "../Pages/CustomerProfile/customer";
import Admin from "../Pages/Admin/Admin";
import RestaurantMenu from "../Pages/restaurantMenu/RestaurantMenu";
import CartPage from "../Pages/restaurantMenu/CartPage";
import OrderSuccessPage from "../Pages/restaurantMenu/OrderSuccessPage";
import RestaurantOwnerPage from "../Pages/OwnerProfile/owner";
import FoodManagementPage from "../Pages/OwnerProfile/FoodManagementPage";
import OrderManagementPage from "../Pages/OwnerProfile/OrderManagmentPage";

export const routes = [
  {
    path: "/",
    element: <HomePage />,
    name: "Home",
  },
  {
    path: "/contact",
    element: <ContactPage />,
    name: "Contact",
  },
  {
    path: "/restaurants",
    element: <DoctorsPage />,
    name: "Doctors",
  },
  {
    path: "/login",
    element: <LoginPage />,
    name: "Login",
  },
  {
    path: "/register",
    element: <RegisterPage />,
    name: "Register",
  },
  {
    path: "/Customer-profile",
    element: (
      <ProtectedRoute requiredRole="Customer">
        <Customer />
      </ProtectedRoute>
    ),
    name: "Customer Profile",
  },
  {
    path: "/admin-profile",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    name: "Admin",
  },
  {
    path: "/admin-profile/restaurants",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    name: "Admin Restaurants",
  },
  {
    path: "/admin-profile/managers",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Admin />
      </ProtectedRoute>
    ),
    name: "Admin Managers",
  },
  {
    path: "/checkout",
    element: (
      <ProtectedRoute requiredRole="Customer">
        <CartPage />
      </ProtectedRoute>
    ),
    name: "checkout",
  },
  {
    path: "/RestaurantOwner-profile",
    element: (
      <ProtectedRoute requiredRole="RestaurantOwner">
        <RestaurantOwnerPage />
      </ProtectedRoute>
    ),
    name: "Restaurant Owner",
  },
  {
    path: "/RestaurantOwner-profile/food-management",
    element: (
      <ProtectedRoute requiredRole="RestaurantOwner">
        <FoodManagementPage />
      </ProtectedRoute>
    ),
    name: "Food Management",
  },
  {
    path: "/RestaurantOwner-profile/order-management",
    element: (
      <ProtectedRoute requiredRole="RestaurantOwner">
        <OrderManagementPage />
      </ProtectedRoute>
    ),
    name: "Order Management",
  },
  {
    path: "/order-success",
    element: <OrderSuccessPage />,
    name: "order-success",
  },
  {
    path: "/restaurant",
    element: <RestaurantMenu />,
    name: "Restaurant Menu",
  },
];
