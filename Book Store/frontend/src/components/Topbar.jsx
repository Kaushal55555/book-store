import React, { useState, useEffect } from "react";
import { Bell, Search, User } from "lucide-react";
import { Link } from "react-router";

const Topbar = ({ isCollapsed }) => {
  const [greeting, setGreeting] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      message: "You have received a new order #12345",
      time: "5 min ago",
      type: "order", // Types can be: order, alert, info
    },
    {
      id: 2,
      title: "Low Stock Alert",
      message: "Book 'React Basics' is running low on stock",
      time: "10 min ago",
      type: "alert",
    },
    {
      id: 3,
      title: "New Review Posted",
      message: "A new 5-star review has been posted for 'JavaScript Guide'",
      time: "1 hour ago",
      type: "info",
    },
  ];

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  const getNotificationColor = (type) => {
    switch (type) {
      case "order":
        return "bg-blue-50 text-blue-700";
      case "alert":
        return "bg-red-50 text-red-700";
      case "info":
        return "bg-green-50 text-green-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white shadow-sm">
      <div
        className={`h-24 px-8 flex items-center justify-between transition-all duration-300
          ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        {/* Left Section - Greeting & Search */}
        <div className="flex items-center space-x-12">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              {greeting},
            </h2>
            <p className="text-base text-gray-500 mt-1">{user.role}</p>
          </div>

          <div className="hidden lg:flex items-center space-x-3 bg-gray-50 rounded-lg px-5 py-3">
            <Search className="h-6 w-6 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none focus:outline-none text-base w-72"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-6">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-3 hover:bg-blue-50 rounded-lg transition-colors relative"
            >
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center">
                {notifications.length}
              </span>
            </button>

            {/* Notifications Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 py-3 flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            notification.type === "order"
                              ? "bg-blue-600"
                              : notification.type === "alert"
                              ? "bg-red-600"
                              : "bg-green-600"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 mt-1 border-t">
                  <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                    View All Notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-base font-medium text-gray-700">
                  {user.username}
                </p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 z-50">
                <button className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-blue-50 flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <Link to={"/settings"}>My Profile</Link>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
