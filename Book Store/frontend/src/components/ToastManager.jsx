// ToastManager.jsx
import React, { useState, useCallback } from "react";
import Toast from "./Toast";

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback(({ message, type = "success", duration = 3000 }) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    return id;
  }, []);

  const close = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => close(toast.id)}
        />
      ))}
    </div>
  );

  return { show, close, ToastContainer };
};

export default useToast;
