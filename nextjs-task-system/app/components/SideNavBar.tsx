"use client";

import { useState, useEffect } from "react";
import { Sidebar, DarkThemeToggle } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiViewBoards, HiUser } from "react-icons/hi";
import { RiLogoutBoxRLine, RiTeamFill } from "react-icons/ri";
import { FaTasks } from "react-icons/fa";

interface User {
  id: string;
  email: string;
  role: string;
}

export const SideNavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/me");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/logout");
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }

  return (
    <Sidebar aria-label="Sidebar with logo branding example">
      <Sidebar.Logo href="#" img="/favicon.ico" imgAlt="Flowbite logo">
        Task Manager
      </Sidebar.Logo>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Sidebar.Item href="/dashboard" icon={HiViewBoards} active={true}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item href="/teams" icon={RiTeamFill}>
            Grupos de trabajo
          </Sidebar.Item>
          {user?.role === "ADMIN" && (
            <>
            <Sidebar.Item href="/users" icon={HiUser}>
            Usuarios
          </Sidebar.Item>
          <Sidebar.Item href="/task" icon={FaTasks}>
            Tareas
          </Sidebar.Item>
          </>
          )}
          <Sidebar.Item href="#" onClick={handleLogout} icon={RiLogoutBoxRLine}>
            Logout
          </Sidebar.Item>
        </Sidebar.ItemGroup>
        <DarkThemeToggle />
      </Sidebar.Items>
    </Sidebar>
  );
};
