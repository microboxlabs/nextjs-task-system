"use client";

import { useAuth } from "@/context/AuthContext";
import { Navbar } from "flowbite-react";
import Link from "next/link";

export default function NavBar() {
  const { token, logout } = useAuth();

  if (!token) {
    return null;
  }

  return (
    <Navbar fluid className="bg-gray-100 dark:bg-gray-800">
      <Navbar.Brand>
        <Link href="/dashboard">
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Task Manager
          </span>
        </Link>
      </Navbar.Brand>

      {/* Agrupar los enlaces de navegación */}
      <Navbar.Collapse>
        <div className="flex space-x-4">
          <Link href="/dashboard" className="hover:underline dark:text-white">
            Dashboard
          </Link>
          <Link href="/users" className="hover:underline dark:text-white">
            Usuarios
          </Link>
          <Link href="/groups" className="hover:underline dark:text-white">
            Grupos
          </Link>
        </div>
      </Navbar.Collapse>

      <Navbar.Toggle />

      {/* Botón de logout */}
      <button
        onClick={logout}
        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
      >
        Logout
      </button>
    </Navbar>
  );
}
