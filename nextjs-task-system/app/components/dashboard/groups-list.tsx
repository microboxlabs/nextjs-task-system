import React, { FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { useUserGroupContext } from "@/contexts/UsersGroupsContext";
import { UserPlus, X, Plus, Loader } from "lucide-react";
import GroupListItem from "./group-list-item";

export default function GroupList() {
  const { groups, createGroup, deleteGroup } = useUserGroupContext();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    createGroup(name).finally(() => {
      setLoading(false);
    });
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex w-full justify-start p-2" variant="ghost">
          <UserPlus className="mr-2 size-4" />
          Groups
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Groups</DialogTitle>
        <DialogDescription>Manage the app groups</DialogDescription>
        <form onSubmit={handleSubmit}>
          <Label>New group</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <Button size="icon" disabled={loading || name.trim() === ""}>
              {loading ? <Loader className="spin-in" /> : <Plus />}
            </Button>
          </div>
        </form>
        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
          <div className="space-y-2">
            {groups &&
              groups.map((group) => (
                <GroupListItem
                  key={group.id}
                  group={group}
                  handleDelete={deleteGroup}
                />
              ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
