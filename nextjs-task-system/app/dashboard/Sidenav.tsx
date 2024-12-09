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
    <Sidebar
      aria-label="Sidebar navigation"
      collapseBehavior="collapse"
      className="min-h-screen"
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* Users */}
          <Sidebar.Item as="div">
            <Link href="/dashboard/users" className="flex items-center gap-2">
              <HiUser className="size-5" />
              <span className="hidden md:block">Users</span>
            </Link>
          </Sidebar.Item>

          {/* Tasks */}
          <Sidebar.Item as="div">
            <Link href="/dashboard/tasks" className="flex items-center gap-2">
              <HiShoppingBag className="size-5" />
              <span className="hidden md:block">Tasks</span>
            </Link>
          </Sidebar.Item>

          {/* Logout */}
          <Sidebar.Item as="div" onClick={handleLogout}>
            <div className="flex w-full cursor-pointer items-center gap-2">
              <HiArrowSmRight className="size-5" />
              <span className="hidden md:block">Logout</span>
            </div>
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
