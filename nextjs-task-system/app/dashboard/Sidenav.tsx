"use client";

import { Sidebar } from "flowbite-react";
import Link from "next/link";
import { HiArrowSmRight, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";

export function Sidenav() {
  return (
    <Sidebar aria-label="Sidebar navigation" collapseBehavior="collapse">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item as="div" icon={HiUser}>
            <Link href="/dashboard/users">Users</Link>
          </Sidebar.Item>
          <Sidebar.Item as="div" icon={HiShoppingBag}>
            <Link href="/dashboard/tasks">Tasks</Link>
          </Sidebar.Item>
          <Sidebar.Item as="div" icon={HiArrowSmRight}>
            <Link href="/sign-in">Sign Out</Link>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
