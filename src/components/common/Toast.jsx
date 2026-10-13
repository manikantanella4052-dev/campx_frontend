import React, { useEffect } from "react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle size={18} className="toast-icon" />,
    error: <AlertCircle size={18} className="toast-icon" />,
    info: <Info size={18} className="toast-icon" />
  };

  return (
    <div className="toast-container">
      <div className={`toast toast-${toast.type || "success"}`}>
        {icons[toast.type] || icons.success}
        <span>{toast.message}</span>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex" }}
          title="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
