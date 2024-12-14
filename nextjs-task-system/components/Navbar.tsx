"use client";

import { useAuthStore } from "@/stores/authStore";
import {
  Avatar,
  CustomFlowbiteTheme,
  DarkThemeToggle,
  Dropdown,
  Navbar as FlowbiteNavbar,
} from "flowbite-react";
import { useRouter } from "next/navigation";

const customNavbarTheme: CustomFlowbiteTheme["navbar"] = {
  root: {
    base: "sticky top-0 mx-auto flex w-full items-center justify-between border-b border-gray-200 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400",
    inner: {
      base: "mx-auto flex w-full max-w-screen-xl flex-wrap items-center justify-between px-4 py-2.5 lg:px-4",
    },
  },
};

export function Navbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <FlowbiteNavbar fluid border theme={customNavbarTheme}>
      <FlowbiteNavbar.Brand href="/">
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Task Manager
        </span>
      </FlowbiteNavbar.Brand>
      <div className="flex md:order-2">
        <DarkThemeToggle className="mr-4" />
        {user && (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{user.name}</span>
              <span className="block truncate text-sm font-medium">
                {user.group}
              </span>
            </Dropdown.Header>
            <Dropdown.Item onClick={handleLogout}>Sign out</Dropdown.Item>
          </Dropdown>
        )}
        <FlowbiteNavbar.Toggle />
      </div>
      {user && (
        <FlowbiteNavbar.Collapse>
          <FlowbiteNavbar.Link href="/dashboard" active>
            Home
          </FlowbiteNavbar.Link>
          {user.role === "admin" && (
            <FlowbiteNavbar.Link href="/tasks/create">
              Create Task
            </FlowbiteNavbar.Link>
          )}
        </FlowbiteNavbar.Collapse>
      )}
    </FlowbiteNavbar>
  );
}
