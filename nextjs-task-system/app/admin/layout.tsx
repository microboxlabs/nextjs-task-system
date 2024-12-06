"use client";

import React, { useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiInbox,
  HiUser,
  HiTable,
  HiMenuAlt1,
  HiX,
  HiLogout,
} from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

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
        // Opcional: Forzar un refresh completo para limpiar el estado
        router.refresh();
      }
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

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
          aria-label="Admin Sidebar"
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

          <Sidebar.Logo href="/admin" img="/favicon.ico" imgAlt="App Logo">
            Admin Dashboard
          </Sidebar.Logo>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item href="/admin" icon={HiChartPie}>
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item href="/admin/tasks" icon={HiInbox}>
                Tasks
              </Sidebar.Item>
              <Sidebar.Item href="/admin/create" icon={HiTable}>
                Create task
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
