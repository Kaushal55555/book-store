import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Book,
  ShoppingCart,
  Tags,
  MessageSquare,
  Settings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      badge: null,
    },
    {
      title: "Books",
      icon: Book,
      path: "/adminBooks",
    },
    {
      title: "Orders",
      icon: ShoppingCart,
      path: "/adminOrders",
    },

    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
      badge: null,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-8 left-4 z-50 p-2 bg-white rounded-lg shadow-lg md:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg
        transition-all duration-300 ease-in-out z-40
        ${isCollapsed ? "w-20" : "w-64"} 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        {/* Collapse Button */}
        <button
          className="absolute -right-3 top-12 hidden md:flex items-center justify-center w-6 h-6 
          bg-white shadow-md rounded-full cursor-pointer"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Logo */}
        <div
          className={`flex items-center h-24 px-4 ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          <div className="flex items-center space-x-3">
            <Book className="w-10 h-10 text-blue-600" />
            {!isCollapsed && (
              <span className="text-2xl font-bold">BookHaven</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 px-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "justify-between"
              } 
              p-3 mb-2 rounded-lg hover:bg-blue-50 group transition-colors
              ${
                location.pathname === item.path
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon
                  className={`w-6 h-6 ${
                    location.pathname === item.path
                      ? "text-blue-600"
                      : "text-gray-600 group-hover:text-blue-600"
                  }`}
                />
                {!isCollapsed && (
                  <span className="font-medium">{item.title}</span>
                )}
              </div>
              {!isCollapsed && item.badge && (
                <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-8 left-0 right-0 px-3">
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isCollapsed ? "justify-center" : ""
            } w-full p-3 
            text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium`}
          >
            <LogOut className="w-6 h-6" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
