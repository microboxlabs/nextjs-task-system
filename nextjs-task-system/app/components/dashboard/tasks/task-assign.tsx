import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, X } from "lucide-react";
import { useUserGroupContext } from "@/contexts/UsersGroupsContext";
import { GroupT, TaskT, UserT } from "@/db/type";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTaskContext } from "@/contexts/TaskContext";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

type UserGroup = UserT | GroupT;

export default function TaskAssign({
  task,
  open,
  onClose,
}: {
  task: TaskT | null;
  open: boolean;
  onClose: () => void;
}) {
  const { users, groups } = useUserGroupContext();
  const { assignTask, unassign } = useTaskContext();
  const [selected, setSelected] = useState<UserGroup | undefined>();
  const [loading, setLoading] = useState(false);

  function handleAssignTask() {
    setLoading(true);
    if (!selected || !task) return;
    let isUser = "email" in selected;
    assignTask(isUser, task.id, selected.id)
      .then(() => {
        setSelected(undefined); // remove before closing the modal
        toast.success("Task assigned");
      })
      .finally(() => {
        setLoading(false);
        onClose();
      });
  }

  function handleUnassign() {
    if (!task) return;
    setLoading(true);
    unassign(task.id).finally(() => {
      setLoading(false);
      onClose();
    });
  }

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Task</DialogTitle>
          <DialogDescription>
            Assign the task {task?.title} to:
          </DialogDescription>
          <div className="my-2 flex">
            {selected && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelected(undefined)}
              >
                {selected?.name}
                <X />
              </Button>
            )}
          </div>
        </DialogHeader>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>
          <TabsContent value="users">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {users &&
                  users.map((user) => (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setSelected(user)}
                      key={`task-assign-${task?.id}-${user.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarImage
                            src={`${user.image}`}
                            alt={user.name || "User avatar"}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{user.name}</span>
                      </div>
                      {selected === user && (
                        <Check className="ml-auto size-4" />
                      )}
                    </Button>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="groups">
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              <div className="space-y-2">
                {groups &&
                  groups.map((group) => (
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => setSelected(group)}
                      key={`task-assign-${task?.id}-${group.id}`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback>
                            {group.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{group.name}</span>
                      </div>
                      {selected === group && (
                        <Check className="ml-auto size-4" />
                      )}
                    </Button>
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
        <DialogFooter className="sm:justify-start">
          <Button
            variant="default"
            disabled={!selected || loading}
            onClick={handleAssignTask}
          >
            Accept
          </Button>
          <Button
            variant="destructive"
            disabled={
              (!task?.assignedToGroupId && !task?.assignedToUserId) || loading
            }
            onClick={handleUnassign}
          >
            Unassign
          </Button>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
