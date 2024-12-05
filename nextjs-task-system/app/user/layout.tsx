"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, Button } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiChartPie, HiInbox, HiMenuAlt1, HiLogout, HiX } from "react-icons/hi";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Mobile Menu Button */}
      <button
        aria-label="Toggle Sidebar"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed left-4 top-4 z-50 rounded-lg bg-gray-800 p-2 text-white md:hidden ${
          isSidebarOpen ? "hidden" : "block"
        }`}
      >
        <HiMenuAlt1 className="h-6 w-6" />
      </button>

      {/* Sidebar with mobile responsiveness */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-40 transition-transform duration-300 md:static md:translate-x-0`}
      >
        <Sidebar
          id="sidebar"
          aria-label="User Sidebar"
          className="relative h-screen w-64 bg-gray-800 text-black"
        >
          {/* Close button - only visible on mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute right-2 top-2 p-2 text-gray-500 hover:text-gray-900 md:hidden"
            aria-label="Close Sidebar"
          >
            <HiX className="h-6 w-6" />
          </button>

          <Sidebar.Logo href="/user" img="/favicon.ico" imgAlt="App Logo">
            User Dashboard
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/user" icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="/user/tasks" icon={HiInbox}>
                My Tasks
              </Sidebar.Item>
            </Sidebar.ItemGroup>

            {/* Sign Out Button Group */}
            <Sidebar.ItemGroup className="mt-auto">
              <Sidebar.Item
                icon={HiLogout}
                onClick={handleSignOut}
                className="cursor-pointer text-red-500 hover:bg-red-100"
              >
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </Sidebar>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 md:ml-0">{children}</main>
    </div>
  );
}
