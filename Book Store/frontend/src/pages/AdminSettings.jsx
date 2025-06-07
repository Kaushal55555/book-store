import React, { useState, useEffect } from "react";
import { User, Lock, Save, AlertCircle, CheckCircle } from "lucide-react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const AdminSettings = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Profile form state
  const [profileData, setProfileData] = useState({
    username: "",
    email: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      // Try to get user data from API first
      try {
        const token = localStorage.getItem("token");

        if (token) {
          const response = await axios.get("http://localhost:8808/profile", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setProfileData({
            username: response.data.username || "",
            email: response.data.email || "",
          });

          // Also update localStorage with the latest data
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            const updatedUser = {
              ...parsedUser,
              username: response.data.username,
              email: response.data.email,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }

          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.log(
          "API fetch failed, falling back to localStorage:",
          apiError
        );
        // Continue to localStorage fallback
      }

      // Fallback to localStorage if API fails
      const userData = localStorage.getItem("user");

      if (userData) {
        const parsedUser = JSON.parse(userData);

        setProfileData({
          username: parsedUser.username || "",
          email: parsedUser.email || "",
        });
      } else {
        // If no user in localStorage, show error
        setErrorMessage("No user data found. Please log in again.");
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setErrorMessage("Failed to load user data. Please try again.");
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Try to update profile via API first
      try {
        const token = localStorage.getItem("token");

        if (token) {
          await axios.put(
            "http://localhost:8808/profile",
            {
              username: profileData.username,
              email: profileData.email,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Also update localStorage
          const userData = localStorage.getItem("user");
          if (userData) {
            const parsedUser = JSON.parse(userData);
            const updatedUser = {
              ...parsedUser,
              username: profileData.username,
              email: profileData.email,
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
          }

          setSuccessMessage("Profile updated successfully!");
          setLoading(false);

          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);

          return;
        }
      } catch (apiError) {
        console.error(
          "API update failed, falling back to localStorage:",
          apiError
        );
        // Only throw if it's a validation error
        if (apiError.response && apiError.response.status < 500) {
          throw new Error(
            apiError.response.data.error ||
              "Failed to update profile. Please check your inputs."
          );
        }
        // Continue to localStorage fallback for server errors
      }

      // Fallback to localStorage if API fails due to connectivity
      const userData = localStorage.getItem("user");

      if (!userData) {
        throw new Error("No user data found");
      }

      const parsedUser = JSON.parse(userData);

      // Update user data with new profile information
      const updatedUser = {
        ...parsedUser,
        username: profileData.username,
        email: profileData.email,
      };

      // Save updated user back to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccessMessage("Profile updated successfully!");

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMessage(
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      // Try to update password via API first
      try {
        const token = localStorage.getItem("token");

        if (token) {
          await axios.put(
            "http://localhost:8808/change-password",
            {
              currentPassword: passwordData.currentPassword,
              newPassword: passwordData.newPassword,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setSuccessMessage("Password changed successfully!");

          // Reset password fields
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });

          setLoading(false);

          // Clear success message after 3 seconds
          setTimeout(() => {
            setSuccessMessage("");
          }, 3000);

          return;
        }
      } catch (apiError) {
        console.error("API password update failed:", apiError);
        // Always throw for password errors since they're likely validation issues
        if (apiError.response && apiError.response.data) {
          throw new Error(
            apiError.response.data.error ||
              "Failed to change password. Please check your current password."
          );
        }
        throw new Error("Failed to connect to server. Please try again.");
      }

      // Fallback to localStorage if API fails
      const userData = localStorage.getItem("user");

      if (!userData) {
        throw new Error("No user data found");
      }

      const parsedUser = JSON.parse(userData);

      // Check if current password matches
      if (parsedUser.password !== passwordData.currentPassword) {
        throw new Error("Current password is incorrect");
      }

      // Update user data with new password
      const updatedUser = {
        ...parsedUser,
        password: passwordData.newPassword,
      };

      // Save updated user back to localStorage
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setSuccessMessage("Password changed successfully!");

      // Reset password fields
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Error changing password:", error);
      setErrorMessage(
        error.message ||
          "Failed to change password. Please check your current password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar isCollapsed={isCollapsed} />

        <main
          className={`flex-1 overflow-y-auto p-6 ${
            isCollapsed ? "ml-20" : "ml-64"
          }`}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600">
              Manage your profile and security settings
            </p>
          </div>

          {/* Notification Messages */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600 flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errorMessage}
            </div>
          )}

          {/* Settings Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "profile"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="h-4 w-4 inline mr-2" />
              Profile Information
            </button>
            <button
              className={`px-6 py-3 font-medium text-sm focus:outline-none ${
                activeTab === "password"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("password")}
            >
              <Lock className="h-4 w-4 inline mr-2" />
              Change Password
            </button>
          </div>

          {/* Profile Form */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-6">Profile Information</h2>
              <form onSubmit={handleProfileSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={profileData.username}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Password Form */}
          {activeTab === "password" && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-6">Change Password</h2>
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-4 mb-6">
                  <div>
                    <label
                      htmlFor="currentPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminSettings;
