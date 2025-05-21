import { Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";

const BackNavBar = ({
  to = "/RestaurantOwner-profile",
  label = "Back to Dashboard",
  className = "",
}) => {
  return (
    <nav
      className={`bg-white shadow-md rounded-xl px-4 py-3 mb-6 flex items-center ${className}`}
    >
      <Link
        to={to}
        className="flex items-center text-crimson hover:text-crimson-dark transition duration-200 font-medium text-base"
      >
        <FiChevronLeft className="mr-2 text-lg" />
        {label}
      </Link>
    </nav>
  );
};

export default BackNavBar;
