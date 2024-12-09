"use client";

import { useState, useEffect } from "react";
import { Sidebar, Button } from "flowbite-react";
import {
  HiChartPie,
  HiClipboardList,
  HiUserAdd,
  HiLogout,
  HiMenu,
  HiX,
  HiUser,
} from "react-icons/hi";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      router.push("/login");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout request failed with status:", response.status);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-gray-900 bg-opacity-50 transition-opacity md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        {/* Close button for mobile */}
        <div className="absolute right-2 top-2 md:hidden">
          <Button color="gray" className="!p-2" onClick={toggleSidebar}>
            <HiX className="h-6 w-6" />
          </Button>
        </div>

        <Sidebar className="h-full border-r border-gray-200 dark:border-gray-700">
          {/* User Welcome Section */}
          <div className="mb-4 border-b border-gray-200 px-4 py-6 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <HiUser className="h-5 w-5 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Welcome,
                </p>
                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  {currentUser
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : "Loading..."}
                </p>
              </div>
            </div>
          </div>

          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="/admin"
                icon={HiChartPie}
                active={pathname === "/admin"}
                onClick={() => setIsSidebarOpen(false)}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                href="/admin/tasks"
                icon={HiClipboardList}
                active={pathname === "/admin/tasks"}
                onClick={() => setIsSidebarOpen(false)}
              >
                Tasks
              </Sidebar.Item>
              <Sidebar.Item
                href="/admin/create"
                icon={HiUserAdd}
                active={pathname === "/admin/create"}
                onClick={() => setIsSidebarOpen(false)}
              >
                Create
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>

          {/* Logout Section */}
          <div className="mt-auto">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item
                  icon={HiLogout}
                  className="cursor-pointer text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700"
                  onClick={() => {
                    setIsSidebarOpen(false);
                    handleLogout();
                  }}
                >
                  Logout
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </Sidebar>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:pl-64">
        {/* Toggle Button for Mobile */}
        <div
          className={`fixed left-4 top-4 z-50 transition-opacity duration-300 md:hidden ${
            isSidebarOpen ? "opacity-0" : "opacity-100"
          }`}
        >
          <Button onClick={toggleSidebar}>
            <HiMenu className="h-6 w-6" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
