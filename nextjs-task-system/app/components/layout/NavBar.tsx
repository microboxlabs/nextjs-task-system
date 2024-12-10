"use client";

import { Navbar, Button } from "flowbite-react";
import Image from "next/image";
import { useAuthStore } from "../../store/authStore";
import { useRouter } from "next/navigation";

export const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/auth/login");
  };

  const UserButtons = () => (
    <div className="flex items-center gap-4">
      {user?.role === "ADMIN" && (
        <Button
          onClick={() => router.push("/app/(views)/admin")}
          aria-label="Admin Dashboard"
        >
          Admin Dashboard
        </Button>
      )}
      {user?.role === "REGULAR" && (
        <Button
          onClick={() => router.push("/app/(views)/user")}
          aria-label="User Task Dashboard"
        >
          My Tasks
        </Button>
      )}
      <Button onClick={handleLogout} aria-label="Log out">
        Logout
      </Button>
    </div>
  );

  const AuthButtons = () => (
    <div className="flex items-center gap-4">
      <Button
        onClick={() => router.push("/auth/login")}
        aria-label="Go to login page"
      >
        Login
      </Button>
      <Button
        onClick={() => router.push("/auth/register")}
        aria-label="Go to register page"
      >
        Register
      </Button>
    </div>
  );

  return (
    <Navbar fluid={true} rounded={true}>
      <Navbar.Brand onClick={() => router.push("/home")}>
        <div className="flex cursor-pointer items-center">
          <Image
            width={50}
            height={50}
            src="/assets/img/logo.png"
            className="mr-3"
            alt="Task System Logo"
            priority
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Task Management System
          </span>
        </div>
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse>
        {isAuthenticated ? (
          <>
            <span className="text-gray-600 dark:text-gray-300">
              Welcome, {user?.email}
            </span>
            <UserButtons />
          </>
        ) : (
          <AuthButtons />
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};
