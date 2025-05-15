import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../../../assets/navbar_logo.png";
import { navbarTabs } from "./constants";
import Button from "../Button/button";
import { useAuthContext } from "../../Contexts/Auth/AuthHook";

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // dispatch logout action
    dispatch({ type: "LOGOUT" });
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 w-full bg-white shadow-md z-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center py-3">
          {/* Logo section */}
          <div className="flex items-center mb-4 md:mb-0">
            <img
              src={logo}
              alt="Crave Delivery"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
            <h1 className="ml-3 text-2xl md:text-3xl font-thin">
              <span className="text-crimson font-medium">Crave</span>{" "}
              <span className="text-gray-800">delivery</span>
            </h1>
          </div>

          {/* Navigation Links - Hamburger menu on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            {navbarTabs.map((tab) => (
              <Link
                key={tab.label}
                to={tab.path}
                className={`relative px-1 py-2 font-medium text-base transition-colors duration-300 hover:text-crimson ${
                  location.pathname === tab.path
                    ? "text-crimson after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-crimson"
                    : "text-gray-800"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            {user ? (
              <>
                <Button
                  text="Profile"
                  bgColor="bg-crimson"
                  hoverBgColor="bg-red-800"
                  textColor="text-white"
                  hoverTextColor="text-white"
                  onClick={() => navigate(`/${user.role}-profile`)}
                />
                <Button
                  text="Log out"
                  bgColor="bg-crimson"
                  hoverBgColor="bg-red-800"
                  textColor="text-white"
                  hoverTextColor="text-white"
                  onClick={logout}
                />
              </>
            ) : (
              <>
                <Button
                  text="Log in"
                  bgColor="bg-crimson"
                  hoverBgColor="bg-red-800"
                  textColor="text-white"
                  hoverTextColor="text-white"
                  onClick={() => navigate("/login")}
                />
                <Button
                  text="Register"
                  bgColor="bg-gray-800"
                  hoverBgColor="bg-crimson"
                  textColor="text-white"
                  hoverTextColor="text-white"
                  onClick={() => navigate("/register")}
                />
              </>
            )}
          </div>

          {/* Mobile menu button - visible on small screens */}
          <button className="md:hidden absolute top-4 right-4 text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Toggle this with state management */}
        <div className="md:hidden hidden">
          <div className="flex flex-col space-y-2 pb-4">
            {navbarTabs.map((tab) => (
              <Link
                key={tab.label}
                to={tab.path}
                className={`px-4 py-2 text-base ${
                  location.pathname === tab.path
                    ? "text-crimson font-medium"
                    : "text-gray-800"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
