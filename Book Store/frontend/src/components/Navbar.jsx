import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  BookOpen,
  Heart,
  Search,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const messageTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Cart item count for demonstration
  const cartItemCount = 3;

  // Monitor scroll position to change navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Main navigation items
  const navItems = [];

  // Handle protected route clicks
  const handleProtectedClick = (e, href) => {
    e.preventDefault();
    e.stopPropagation();

    // Show login message
    setShowLoginMessage(true);

    // Clear any existing timeout
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }

    // Set timeout to hide message after 3 seconds
    messageTimeoutRef.current = setTimeout(() => {
      setShowLoginMessage(false);
    }, 3000);

    // Optionally redirect after a short delay
    // setTimeout(() => {
    //   navigate('/login');
    // }, 1500);
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    if (activeDropdown === index) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(index);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Clean up the timeout on unmount
  useEffect(() => {
    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, []);

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-lg py-2"
          : "bg-gradient-to-r from-blue-50 via-white to-indigo-50 py-4"
      }`}
      role="navigation"
    >
      {/* Login Message Toast */}
      {showLoginMessage && (
        <div className="absolute top-full left-0 right-0 mx-auto w-max mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fadeIn z-50">
          <AlertCircle className="h-5 w-5" />
          <p>Please login to access this feature</p>
        </div>
      )}

      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-blue-50 transition-all"
          >
            <BookOpen className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <span
              className={`font-bold text-gray-800 transition-all ${
                isScrolled ? "text-2xl" : "text-3xl"
              }`}
            >
              BookHaven
            </span>
          </Link>

          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:block flex-grow max-w-xl mx-12">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for books, authors, or genres..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <div
                key={item.name}
                className="relative"
                onClick={(e) => {
                  if (item.hasDropdown) {
                    e.stopPropagation();
                    toggleDropdown(index);
                  }
                }}
              >
                {item.requiresAuth ? (
                  <a
                    href="#"
                    onClick={(e) => handleProtectedClick(e, item.href)}
                    className={`text-base px-3 py-2 rounded-lg transition-all flex items-center ${
                      item.href === window.location.pathname
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>
                ) : (
                  <Link
                    to={!item.hasDropdown ? item.href : "#"}
                    className={`text-base px-3 py-2 rounded-lg transition-all flex items-center ${
                      item.href === window.location.pathname
                        ? "text-blue-600 font-semibold bg-blue-50"
                        : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`ml-1 h-4 w-4 transition-transform ${
                          activeDropdown === index ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-2 z-20">
                    {item.dropdownItems.map((dropdownItem) =>
                      dropdownItem.requiresAuth ? (
                        <a
                          key={dropdownItem.name}
                          href="#"
                          onClick={(e) =>
                            handleProtectedClick(e, dropdownItem.href)
                          }
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {dropdownItem.name}
                        </a>
                      ) : (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        >
                          {dropdownItem.name}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist Button */}
            <a
              href="#"
              onClick={(e) => handleProtectedClick(e, "/wishlist")}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            >
              <Heart className="h-6 w-6" />
            </a>

            {/* Cart Button */}
            <a
              href="#"
              onClick={(e) => handleProtectedClick(e, "/cart")}
              className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>

            {/* Login Button */}
            <Link
              to="/login"
              className={`${
                isScrolled
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
              } font-medium px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-lg`}
            >
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <a
              href="#"
              onClick={(e) => handleProtectedClick(e, "/cart")}
              className="relative p-2 text-gray-600"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </a>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="text-gray-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 hover:bg-blue-50 transition-all"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute left-0 right-0 bg-white shadow-xl border-t transition-all duration-300 ${
            isMenuOpen
              ? "max-h-[80vh] overflow-y-auto opacity-100"
              : "max-h-0 overflow-hidden opacity-0"
          }`}
        >
          {/* Mobile Search Bar */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for books..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Mobile Navigation Items */}
          <div className="py-4 space-y-1 px-4">
            {navItems.map((item, index) => (
              <div key={item.name}>
                <div
                  className={`flex justify-between items-center px-3 py-3 rounded-lg ${
                    item.href === window.location.pathname
                      ? "text-blue-600 font-semibold bg-blue-50"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.hasDropdown) {
                      toggleDropdown(index);
                    } else if (item.requiresAuth) {
                      handleProtectedClick(e, item.href);
                    } else {
                      setIsMenuOpen(false);
                    }
                  }}
                >
                  {item.requiresAuth ? (
                    <a
                      href="#"
                      onClick={(e) => handleProtectedClick(e, item.href)}
                      className="flex-grow"
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      to={!item.hasDropdown ? item.href : "#"}
                      className="flex-grow"
                    >
                      {item.name}
                    </Link>
                  )}
                  {item.hasDropdown && (
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        activeDropdown === index ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {/* Mobile Dropdown */}
                {item.hasDropdown && activeDropdown === index && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-blue-100 pl-4">
                    {item.dropdownItems.map((dropdownItem) =>
                      dropdownItem.requiresAuth ? (
                        <a
                          key={dropdownItem.name}
                          href="#"
                          onClick={(e) =>
                            handleProtectedClick(e, dropdownItem.href)
                          }
                          className="block px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                        >
                          {dropdownItem.name}
                        </a>
                      ) : (
                        <Link
                          key={dropdownItem.name}
                          to={dropdownItem.href}
                          className="block px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {dropdownItem.name}
                        </Link>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Footer */}
          <div className="p-4 border-t flex flex-col space-y-3">
            <a
              href="#"
              onClick={(e) => handleProtectedClick(e, "/wishlist")}
              className="flex items-center space-x-2 px-3 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
            >
              <Heart className="h-5 w-5" />
              <span>My Wishlist</span>
            </a>

            <Link
              to="/login"
              className="bg-blue-600 text-white text-center font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Add animation for toast */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
