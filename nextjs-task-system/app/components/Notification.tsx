"use client";

import { useEffect } from "react";

interface NotificationProps {
  message: string;
  type?: "success" | "error" | "info"; 
  duration?: number; 
  onClose: () => void; 
}

export function Notification({
  message,
  type = "info",
  duration = 5000,
  onClose,
}: NotificationProps) {
  
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer); 
    }
  }, [duration, onClose]);

  
  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-700 border-green-400";
      case "error":
        return "bg-red-100 text-red-700 border-red-400";
      case "info":
        return "bg-blue-100 text-blue-700 border-blue-400";
      default:
        return "bg-gray-100 text-gray-700 border-gray-400";
    }
  };

  return (
    <div
      className={`fixed right-4 top-4 z-50 flex items-center gap-4 rounded-md border p-4 shadow-lg ${getTypeClasses()}`}
    >
      <p>{message}</p>
      <button
        onClick={onClose}
        className="text-lg font-bold leading-none text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
}
