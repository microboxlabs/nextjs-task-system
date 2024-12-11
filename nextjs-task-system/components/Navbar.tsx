"use client";

import { Navbar, Dropdown, Avatar, DarkThemeToggle } from "flowbite-react";

export default function AppNavbar() {
  return (
    <Navbar fluid border>
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4">
        <Navbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Task Manager
          </span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <DarkThemeToggle className="mr-4" />
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User" rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">Admin</span>
              <span className="block truncate text-sm font-medium">
                admin@example.com
              </span>
            </Dropdown.Header>
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/dashboard" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="/tasks/create">Create Task</Navbar.Link>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
}
