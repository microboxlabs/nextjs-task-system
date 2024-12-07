"use client";

import { Sidebar } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiArrowSmRight, HiShoppingBag, HiUser } from "react-icons/hi";

export function Sidenav() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

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
          <Sidebar.Item
            as="button"
            icon={HiArrowSmRight}
            onClick={handleLogout}
          >
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
