import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Package,
  CreditCard,
  User,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Book,
  ShoppingBag,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SingleOrder = () => {
  const { id } = useParams();

  console.log(id);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8808/orders/${id}`);
      setOrder(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Failed to fetch order details: " +
          (err.response?.data?.error || err.message)
      );
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setStatusUpdateLoading(true);
    try {
      await axios.put(`http://localhost:8808/orders/${id}/status`, {
        status: newStatus,
      });

      // Refresh order data
      fetchOrderDetails();

      // Show success message
      alert(`Order status updated to ${newStatus}`);
    } catch (err) {
      setError(
        "Failed to update order status: " +
          (err.response?.data?.error || err.message)
      );
      console.error("Error updating order status:", err);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
      CANCELED: { color: "bg-red-100 text-red-800", label: "Canceled" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentBadge = (status) => {
    if (status === "SUCCESS") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          Success
        </span>
      );
    } else if (status === "PENDING") {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          Failed
        </span>
      );
    }
  };

  const getStatusActions = () => {
    if (!order) return null;

    const buttons = [];

    if (order.status === "PENDING") {
      buttons.push(
        <button
          key="complete"
          onClick={() => updateOrderStatus("COMPLETED")}
          disabled={statusUpdateLoading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
        >
          {statusUpdateLoading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
          Mark as Completed
        </button>
      );

      buttons.push(
        <button
          key="cancel"
          onClick={() => updateOrderStatus("CANCELED")}
          disabled={statusUpdateLoading}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center gap-2 ml-3"
        >
          {statusUpdateLoading ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          Cancel Order
        </button>
      );
    }

    return <div className="flex mt-4">{buttons}</div>;
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <Link
                to="/adminOrders"
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Orders
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                Order Details
              </h1>
            </div>

            {order && (
              <div className="flex items-center gap-3">
                {getStatusBadge(order.status)}
              </div>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : order ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Order Summary */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm mb-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order Summary
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center mb-4">
                          <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Order Date</p>
                            <p className="font-medium">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <ShoppingBag className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Order ID</p>
                            <p className="font-medium">#{order.id}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Method
                            </p>
                            <p className="font-medium">
                              {order.payment?.method || "Not specified"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center mb-4">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm text-gray-500">Customer</p>
                            <p className="font-medium">
                              {order.user?.username ||
                                `User ID: ${order.userId}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center mb-4">
                          <CheckCircle
                            className={`h-5 w-5 mr-2 ${
                              order.payment?.status === "SUCCESS"
                                ? "text-green-500"
                                : order.payment?.status === "PENDING"
                                ? "text-yellow-500"
                                : "text-red-500"
                            }`}
                          />
                          <div>
                            <p className="text-sm text-gray-500">
                              Payment Status
                            </p>
                            <div>{getPaymentBadge(order.payment?.status)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {getStatusActions()}
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order Items
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Product
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Price
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Quantity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded-md flex items-center justify-center">
                                  {item.book.imageUrl ? (
                                    <img
                                      src={item.book.imageUrl}
                                      alt={item.book.title}
                                      className="h-10 w-10 object-cover rounded-md"
                                    />
                                  ) : (
                                    <Book className="h-5 w-5 text-gray-400" />
                                  )}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {item.book.title}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {item.book.author}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatCurrency(item.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(
                                Number(item.price) * item.quantity
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm sticky top-6">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">
                      Order Total
                    </h2>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-sm border-t border-gray-200">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-gray-900">
                        Rs. 0.00
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-sm border-t border-gray-200">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium text-gray-900">
                        Rs. 0.00
                      </span>
                    </div>
                    <div className="flex justify-between py-3 text-base font-medium border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-2">
                      <div
                        className={`text-sm font-medium mb-2 ${
                          order.status === "COMPLETED"
                            ? "text-green-600"
                            : order.status === "PENDING"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        Order Status: {order.status}
                      </div>

                      <div className="text-sm text-gray-500">
                        {order.status === "PENDING" &&
                          "This order is awaiting processing."}
                        {order.status === "COMPLETED" &&
                          "This order has been completed."}
                        {order.status === "CANCELED" &&
                          "This order has been canceled."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-800 mb-2">
                Order not found
              </h3>
              <p className="text-gray-500 mb-6">
                The order you're looking for doesn't exist or you don't have
                permission to view it.
              </p>
              <Link
                to="/admin/orders"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Return to Orders
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SingleOrder;
