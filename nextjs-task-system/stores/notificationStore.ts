// stores/notificationStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface Notification {
  message: string;
  type: "success" | "error";
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  removeNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>()(
  devtools((set) => ({
    notifications: [],
    addNotification: (notification) =>
      set((state) => ({
        notifications: [...state.notifications, notification],
      })),
    removeNotification: (notification) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n !== notification),
      })),
  })),
);
