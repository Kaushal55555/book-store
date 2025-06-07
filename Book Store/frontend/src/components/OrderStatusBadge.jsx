import React from "react";

const OrderStatusBadge = ({ status }) => {
  // Map your Prisma OrderStatus enum values to colors and labels
  const statusConfig = {
    PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
    COMPLETED: { color: "bg-green-100 text-green-800", label: "Completed" },
    CANCELED: { color: "bg-red-100 text-red-800", label: "Canceled" },
  };

  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;
