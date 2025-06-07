import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const DashboardStats = () => {
  const [loading, setLoading] = useState(true);
  const [orderStats, setOrderStats] = useState(null);
  const [bookStats, setBookStats] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [revenueStats, setRevenueStats] = useState(null);

  const API_URL = "http://localhost:8808/api";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [orderRes, bookRes, userRes, revenueRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/orders`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${API_URL}/dashboard/books`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${API_URL}/dashboard/users`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
          axios.get(`${API_URL}/dashboard/revenue`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }),
        ]);

        setOrderStats(orderRes.data);
        setBookStats(bookRes.data);
        setUserStats(userRes.data);
        setRevenueStats(revenueRes.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching stats:", error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Order status chart data
  const orderStatusData = {
    labels: orderStats?.ordersByStatus?.map((stat) => stat.status) || [],
    datasets: [
      {
        label: "Orders by Status",
        data: orderStats?.ordersByStatus?.map((stat) => stat._count) || [],
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  // Order trends chart data
  const orderTrendsData = {
    labels: orderStats?.ordersByDate?.map((item) => item.date) || [],
    datasets: [
      {
        label: "Orders",
        data: orderStats?.ordersByDate?.map((item) => item.count) || [],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Book genre chart data
  const bookGenreData = {
    labels:
      bookStats?.booksByGenre?.map((item) => item.genre || "Uncategorized") ||
      [],
    datasets: [
      {
        label: "Books by Genre",
        data: bookStats?.booksByGenre?.map((item) => item._count) || [],
        backgroundColor: [
          "#4F46E5",
          "#10B981",
          "#F59E0B",
          "#EF4444",
          "#8B5CF6",
          "#EC4899",
          "#14B8A6",
          "#F97316",
          "#6366F1",
          "#06B6D4",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Stock distribution chart data
  const stockDistData = {
    labels: bookStats?.stockDistribution
      ? ["Out of Stock", "Low Stock", "Adequate Stock", "High Stock"]
      : [],
    datasets: [
      {
        label: "Book Stock Distribution",
        data: bookStats?.stockDistribution
          ? [
              bookStats.stockDistribution.outOfStock,
              bookStats.stockDistribution.lowStock,
              bookStats.stockDistribution.adequateStock,
              bookStats.stockDistribution.highStock,
            ]
          : [],
        backgroundColor: ["#EF4444", "#F59E0B", "#10B981", "#4F46E5"],
        borderWidth: 1,
      },
    ],
  };

  // User trend chart data
  const userTrendData = {
    labels: userStats?.userTrends?.map((item) => item.month) || [],
    datasets: [
      {
        label: "New Users",
        data: userStats?.userTrends?.map((item) => item.count) || [],
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Revenue trend chart data
  const revenueTrendData = {
    labels: revenueStats?.revenueTrends?.map((item) => item.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: revenueStats?.revenueTrends?.map((item) => item.amount) || [],
        borderColor: "#F59E0B",
        backgroundColor: "rgba(245, 158, 11, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // Payment method chart data
  const paymentMethodData = {
    labels: revenueStats?.revenueByPayment?.map((item) => item.method) || [],
    datasets: [
      {
        label: "Revenue by Payment Method",
        data:
          revenueStats?.revenueByPayment?.map((item) => item._sum.paidAmount) ||
          [],
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "" },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Dashboard Analytics
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Order Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
              <div className="h-64">
                <Pie data={orderStatusData} options={pieChartOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                Order Trends (Last 30 Days)
              </h2>
              <div className="h-64">
                <Line data={orderTrendsData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          {/* Book Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">Books by Genre</h2>
              <div className="h-64">
                <Pie data={bookGenreData} options={pieChartOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                Book Stock Distribution
              </h2>
              <div className="h-64">
                <Pie data={stockDistData} options={pieChartOptions} />
              </div>
            </div>
          </div>

          {/* User & Revenue Statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                New Users (Last 6 Months)
              </h2>
              <div className="h-64">
                <Line data={userTrendData} options={lineChartOptions} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-4">
                Revenue (Last 12 Months)
              </h2>
              <div className="h-64">
                <Line data={revenueTrendData} options={lineChartOptions} />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">
              Revenue by Payment Method
            </h2>
            <div className="h-64 flex justify-center">
              <div className="w-1/2">
                <Pie data={paymentMethodData} options={pieChartOptions} />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardStats;
