"use client";
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { LogOut, Users, UserPlus, Menu, User } from "lucide-react";
import { useUserContext } from "@/contexts/UserContext";
import GroupList from "./groups-list";
import { useRouter } from "next/navigation";
export default function NavDropdown() {
  const { user, isAdmin, logout } = useUserContext();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="text-white">
          <Menu className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {user && (
          <>
            <DropdownMenuItem>
              <Avatar>
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>
                  {user.name ? user.name[0] : "U"}
                </AvatarFallback>
              </Avatar>
              {user.name}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isAdmin && (
              <>
                <DropdownMenuItem
                  onClick={() => router.push("/dashboard/users")}
                >
                  <User />
                  Users
                </DropdownMenuItem>
                {/* <UsersList /> */}
                <GroupList />
              </>
            )}
            <DropdownMenuItem onClick={logout}>
              <LogOut className="mr-2 size-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
