"use client";
import { notifications } from "@/types/notifications-types";
import { Button, Sidebar } from "flowbite-react";
import { useState, useEffect } from "react";
import { IoIosNotifications } from "react-icons/io";

interface Props {
  notifications: notifications[];
}

export default function NotificationSideBar({ notifications }: Props) {
  const [isNotificationSidebarOpen, setNotificationSidebarOpen] =
    useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  {
    /* function to animate the opening*/
  }
  const closeNotificationSidebar = () => {
    setIsClosing(true);
    setTimeout(() => {
      setNotificationSidebarOpen(false);
      setIsClosing(false);
    }, 200); // those are delays to let the page run the animation
  };

  {
    /* function to animate the opening*/
  }
  const openNotificationSidebar = () => {
    setNotificationSidebarOpen(true);
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
    }, 200); // those are delays to let the page run the animation
  };

  useEffect(() => {
    if (isNotificationSidebarOpen) {
      setIsClosing(false);
    }
  }, [isNotificationSidebarOpen]);

  return (
    <>
      <button
        type="button"
        onClick={openNotificationSidebar}
        className="group flex w-full items-center rounded-lg text-left text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        <Sidebar.Item
          href="#"
          icon={IoIosNotifications}
          className="flex items-center gap-2"
        >
          Notifications
        </Sidebar.Item>
      </button>

      {isNotificationSidebarOpen && (
        <div className="relative overflow-auto">
          <div className="fixed inset-0 top-0 z-50 bg-gray-800 bg-opacity-50">
            <div
              className={`fixed left-0 top-0 h-full w-64 transform bg-white p-4 shadow-lg transition-all duration-200 ease-in-out dark:bg-gray-800
                        ${
                          isClosing
                            ? "-translate-x-full opacity-0"
                            : isOpening
                              ? "-translate-x-full opacity-0"
                              : "translate-x-0 opacity-100"
                        }`}
            >
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-xl text-gray-900 dark:text-white">
                  Notificaciones
                </h2>
                <Button
                  size={"sm"}
                  className="bg-red-500 text-end"
                  onClick={closeNotificationSidebar}
                >
                  Cerrar
                </Button>
              </div>
              <ul className="mt-4 max-h-[calc(100vh-4rem)] flex-grow space-y-4 overflow-y-auto px-4">
                {notifications.map(
                  (notification: notifications, index: number) => (
                    <li key={index} className="text-gray-800 dark:text-white">
                      <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                          {notification.message}
                        </p>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
