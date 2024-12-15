"use client";
import {
  Avatar,
  Badge,
  Button,
  DarkThemeToggle,
  Dropdown,
  Navbar as NavbarFlowBite,
} from "flowbite-react";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo } from "react";
import { getAvatarUrl } from "../utils/getAvatarUrl";

export const Navbar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  const avatarUrl = useMemo(() => {
    return getAvatarUrl(session?.user.name || "n h");
  }, [session?.user.name]);

  if (status === "loading") return null;
  return (
    <NavbarFlowBite fluid rounded className="sticky top-0 z-10">
      <Link href="/">
        <NavbarFlowBite.Brand>
          <img
            src="https://getonbrd-prod.s3.amazonaws.com/uploads/users/logo/15729/MBL_2_SIN_FONDO(2).png"
            className="mr-3 h-6 sm:h-9"
            alt="ML Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Tasks System
          </span>
        </NavbarFlowBite.Brand>
      </Link>
      <div className="flex gap-2 md:order-2">
        <DarkThemeToggle />
        {session ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={<Avatar alt="User settings" img={avatarUrl} rounded />}
          >
            <Dropdown.Header>
              <span className="block text-sm">{session.user?.name}</span>
              <Badge className="ml-auto inline-block" color="gray">
                {(session.user as any).role}
              </Badge>
              <span className="block truncate text-sm font-medium">
                {session.user?.email}
              </span>
            </Dropdown.Header>
            {/* <Dropdown.Divider /> */}
            <Dropdown.Item onClick={() => signOut()}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        )}
        {session && <NavbarFlowBite.Toggle />}
      </div>
      {session && session.user.role === "Admin" && (
        <NavbarFlowBite.Collapse>
          <Link href="/">
            <NavbarFlowBite.Link active={pathname === "/"}>
              Dashboard
            </NavbarFlowBite.Link>
          </Link>
          <Link href="/tasks/create">
            <NavbarFlowBite.Link active={pathname === "/tasks/create"}>
              Create Task
            </NavbarFlowBite.Link>
          </Link>
        </NavbarFlowBite.Collapse>
      )}
    </NavbarFlowBite>
  );
};
