"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "flowbite-react";
import { HiChartPie } from "react-icons/hi";
import { FaTasks } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";

export function SidebarComponent() {
  // Initialize state based on whether the window width is large enough (if available)
  const isClient = typeof window !== "undefined";
  const [isOpen, setIsOpen] = useState(
    isClient ? window.innerWidth >= 768 : false,
  );

  const pathname = usePathname() || "";

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Button to toggle sidebar for small screens */}
      <button
        onClick={toggleSidebar}
        type="button"
        className="ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 md:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar component */}
      <Sidebar
        id="sidebar-menu"
        aria-label="Sidebar with logo branding example"
        className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar.Logo href="/" img="/favicon.ico" imgAlt="Flowbite logo">
          Flowbite
        </Sidebar.Logo>
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Sidebar.Item href="/" icon={HiChartPie} active={pathname === "/"}>
              Dashboard
            </Sidebar.Item>
            <Sidebar.Item
              href="/tasks"
              icon={FaTasks}
              active={pathname === "/tasks"}
            >
              Tasks
            </Sidebar.Item>
            <Sidebar.Item
              href="/create"
              icon={IoIosCreate}
              active={pathname === "/create"}
            >
              Create
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
}
