/**
 * ToastContainer.jsx
 * Container for managing multiple toast notifications
 */

import { useState, useCallback } from "react";
import Toast from "./Toast";

function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 3000) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Expose methods globally for easy access
  window.toast = {
    success: (title, message) => addToast("success", title, message),
    error: (title, message) => addToast("error", title, message),
    warning: (title, message) => addToast("warning", title, message),
    info: (title, message) => addToast("info", title, message),
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>
  );
}

export default ToastContainer;
