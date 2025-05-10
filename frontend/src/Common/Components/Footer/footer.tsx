import { socialMediaLinks, navigationLinks } from "./constants";
import { Link, useLocation } from "react-router-dom";

const Footer: React.FC = () => {
  const location = useLocation();

  return (
    <footer className="bg-[#1a1a1a] text-white py-10 w-full font-sans">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Branding & Description */}
        <div className="mb-6 md:mb-0 space-y-2 max-w-sm">
          <h2 className="text-3xl font-bold text-white">Crave</h2>
          <p className="text-sm text-gray-300">
            Discover and order from your favorite restaurants — fresh, fast, and
            at your fingertips.
          </p>
          <div className="mt-4 flex space-x-4">
            {socialMediaLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-75 transition"
              >
                <img src={link.src} alt={link.alt} className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-300">
          {navigationLinks.map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className={`hover:text-crimson transition-colors duration-300 ${
                location.pathname === link.to
                  ? "text-crimson font-semibold"
                  : ""
              }`}
            >
              {link.text}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div className="mt-6 md:mt-0 text-gray-400 text-xs text-center md:text-right">
          <p>
            &copy; <span className="font-medium">2024</span> Crave. All rights
            reserved.
          </p>
          <p>Delicious moments delivered.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
