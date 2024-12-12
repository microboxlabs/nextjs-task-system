"use client";

import { useState, useEffect } from "react";
import { Sidebar, DarkThemeToggle, Button, Drawer } from "flowbite-react";
import { useRouter } from "next/navigation";
import { HiViewBoards, HiUser, HiMenu } from "react-icons/hi";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

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
    <>
      <div className="flex flex-wrap gap-2 min-h-[10vh] items-center justify-center">
        {!isOpen && (<Button onClick={() => setIsOpen(true)}>
          <HiMenu className="mr-2 h-5 w-5"  /> Open Navbar
        </Button>)}
      </div>
      <Drawer backdrop={false} open={isOpen} onClose={handleClose} >
        <Drawer.Header title="MENU" titleIcon={() => <></>} />
        <Drawer.Items>
          <Sidebar aria-label="Sidebar with logo branding example">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item href="/dashboard" icon={HiViewBoards} active={true}>
                  Dashboard
                </Sidebar.Item>
                <Sidebar.Item href="/teams" icon={RiTeamFill}>
                  My teams
                </Sidebar.Item>
                {user?.role === "ADMIN" && (
                  <>
                    <Sidebar.Item href="/teams/create" icon={HiUser}>
                      Create Team
                    </Sidebar.Item>
                    <Sidebar.Item href="/users" icon={HiUser}>
                      Users
                    </Sidebar.Item>
                    <Sidebar.Item href="/task" icon={FaTasks}>
                      Create tasks
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
        </Drawer.Items>
      </Drawer >
    </>
  );
};
