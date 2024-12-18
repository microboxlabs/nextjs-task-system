import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle } from "lucide-react";
import { UserT, GroupT, GroupMembershipT } from "@/db/type";
import { useUserGroupContext } from "@/contexts/UsersGroupsContext";
interface GroupManagementDialogProps {
  user: UserT;
  allGroups: GroupT[];
}

function checkMembershipExists(
  userGroups: GroupMembershipT[],
  groupId: string,
) {
  return userGroups.find((membership) => membership.groupId === groupId);
}

export function GroupManagementDialog({
  user,
  allGroups,
}: GroupManagementDialogProps) {
  const { manageMembership } = useUserGroupContext();
  const [open, setOpen] = useState(false);
  const [selectedGroups, setSelectedGroups] = useState<GroupMembershipT[]>(
    user.groupMemberships || [],
  );
  useEffect(() => {
    setSelectedGroups(user.groupMemberships || []);
  }, [user.groupMemberships]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Manage Groups
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Manage Groups for {user.name}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[200px] pr-4">
          {allGroups.map((group) => {
            const membership = checkMembershipExists(selectedGroups, group.id);
            const isMember = Boolean(membership);
            return (
              <div key={group.id} className="mb-2 flex items-center space-x-2">
                <Checkbox
                  id={`group-${group}`}
                  checked={isMember}
                  onCheckedChange={() =>
                    manageMembership(
                      user.id,
                      membership ? membership.id : group.id,
                      !isMember,
                    )
                  }
                />
                <Label htmlFor={`group-${group}`}>{group.name}</Label>
              </div>
            );
          })}
        </ScrollArea>

        <Button
          className="ml-auto mt-4 w-fit"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
