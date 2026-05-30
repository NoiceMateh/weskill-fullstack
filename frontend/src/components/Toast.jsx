/**
 * Toast.jsx
 * Toast notification system with multiple types
 */

import { useEffect } from "react";
import { X } from "lucide-react";

function Toast({ id, type = "info", title, message, duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const typeConfig = {
    success: {
      icon: "✓",
      className: "toast-success",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-900",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
    error: {
      icon: "✕",
      className: "toast-error",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-900",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    warning: {
      icon: "⚠",
      className: "toast-warning",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-900",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
    },
    info: {
      icon: "ℹ",
      className: "toast-info",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-900",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div
      className={`toast ${config.className} animate-slide-in-right mb-3 flex items-start gap-4 rounded-lg border ${config.borderColor} ${config.bgColor} p-4 shadow-lg`}
      role="alert"
    >
      <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${config.iconBg} flex-shrink-0`}>
        <span className={`text-lg font-bold ${config.iconColor}`}>{config.icon}</span>
      </div>
      <div className="flex-1">
        <h4 className={`font-semibold ${config.textColor}`}>{title}</h4>
        <p className={`text-sm ${config.textColor} opacity-80`}>{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className={`flex-shrink-0 ${config.iconColor} hover:opacity-70 transition-opacity`}
      >
        <X size={18} />
      </button>
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-current to-transparent" />
    </div>
  );
}

export default Toast;
