import React from "react";

const OrderActionMenu = ({ order, updateOrderStatus }) => {
  return (
    <div
      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border"
      onClick={(e) => e.stopPropagation()}
    >
      {order.status === "PENDING" && (
        <button
          onClick={() => updateOrderStatus(order.id, "PROCESSING")}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Mark as Processing
        </button>
      )}
      {order.status === "PROCESSING" && (
        <button
          onClick={() => updateOrderStatus(order.id, "SHIPPED")}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Mark as Shipped
        </button>
      )}
      {order.status === "SHIPPED" && (
        <button
          onClick={() => updateOrderStatus(order.id, "DELIVERED")}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
        >
          Mark as Delivered
        </button>
      )}
      {(order.status === "PENDING" || order.status === "PROCESSING") && (
        <button
          onClick={() => updateOrderStatus(order.id, "CANCELED")}
          className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

export default OrderActionMenu;
