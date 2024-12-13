// components/Toast.tsx
"use client";

import React from "react";
import { useNotificationStore } from "@/stores/notificationStore";
import { Toast as FlowbiteToast } from "flowbite-react";
import { HiX, HiCheck } from "react-icons/hi";

interface Notification {
  type: "error" | "success";
  message: string;
}

export const Toast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <div className="fixed right-0 top-0 p-4">
      {notifications.map((notification: Notification, index: number) => (
        <FlowbiteToast key={index} className="mb-2">
          <div
            className={`inline-flex items-center justify-center rounded-lg ${
              notification.type === "error"
                ? "bg-red-100 text-red-500"
                : "bg-green-100 text-green-500"
            }`}
          >
            {notification.type === "error" ? (
              <HiX className="size-5" />
            ) : (
              <HiCheck className="size-5" />
            )}
          </div>
          <div className="ml-3 text-sm font-normal">{notification.message}</div>
          <FlowbiteToast.Toggle
            onDismiss={() => removeNotification(notification)}
          />
        </FlowbiteToast>
      ))}
    </div>
  );
};
