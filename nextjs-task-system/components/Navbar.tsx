"use client";

import {
  Avatar,
  DarkThemeToggle,
  Dropdown,
  Navbar as FlowbiteNavbar,
} from "flowbite-react";

export function Navbar() {
  return (
    <FlowbiteNavbar fluid border>
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4">
        <FlowbiteNavbar.Brand href="/">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Task Manager
          </span>
        </FlowbiteNavbar.Brand>
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
          <FlowbiteNavbar.Toggle />
        </div>
        <FlowbiteNavbar.Collapse>
          <FlowbiteNavbar.Link href="/dashboard" active>
            Home
          </FlowbiteNavbar.Link>
          <FlowbiteNavbar.Link href="/tasks/create">
            Create Task
          </FlowbiteNavbar.Link>
        </FlowbiteNavbar.Collapse>
      </div>
    </FlowbiteNavbar>
  );
}
