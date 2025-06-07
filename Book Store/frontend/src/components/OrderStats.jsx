import React from "react";
import { Package, Calendar, TruckIcon, CheckCircle } from "lucide-react";

const OrderStats = ({ orders }) => {
  const pendingCount = orders.filter(
    (order) => order.status === "PENDING"
  ).length;
  const completedCount = orders.filter(
    (order) => order.status === "COMPLETED"
  ).length;
  const canceledCount = orders.filter(
    (order) => order.status === "CANCELED"
  ).length;
  const shippedCount = orders.filter(
    (order) => order.status === "SHIPPED"
  ).length;
  const deliveredCount = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <TruckIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Shipped</p>
            <p className="text-2xl font-bold text-gray-900">{shippedCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Delivered</p>
            <p className="text-2xl font-bold text-gray-900">{deliveredCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
