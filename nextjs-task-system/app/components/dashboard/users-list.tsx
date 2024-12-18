import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useUserGroupContext } from "@/contexts/UsersGroupsContext";
import { Users } from "lucide-react";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
export default function UsersList() {
  const { users } = useUserGroupContext();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full justify-start p-2" variant="ghost">
          <Users className="mr-2 size-4" />
          Users
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Users</DialogTitle>
        <DialogDescription>Manage the app users</DialogDescription>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {users &&
              users.map((user) => (
                <div
                  className="flex w-full justify-between"
                  key={`manage-users-${user.id}`}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="size-6">
                      <AvatarImage
                        src={`${user.image}`}
                        alt={user.name || "User avatar"}
                      />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{user.name}</span>
                  </div>
                  {/* TODO -> Should add the capability to change users to admin */}
                  {/* <div className="flex items-center space-x-2">
                    <Switch
                      id="airplane-mode"
                      checked={user.role === "ADMIN"}
                      onChange={() => {

                      }}
                    />
                    <Label htmlFor="airplane-mode">Admin</Label>
                  </div> */}
                </div>
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
