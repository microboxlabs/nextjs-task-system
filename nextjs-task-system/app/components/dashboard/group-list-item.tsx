import { GroupT } from "@/db/type";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";

export default function GroupListItem({
  group,
  handleDelete,
}: {
  group: GroupT;
  handleDelete: (groupId: string) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  function handleGroupDelete() {
    setLoading(true);
    handleDelete(group.id).finally(() => setLoading(false));
  }
  return (
    <div
      className="flex w-full justify-between"
      key={`manage-groups-${group.id}`}
    >
      <div className="flex items-center gap-2">
        <Avatar className="size-6">
          <AvatarFallback>{group.name?.charAt(0)}</AvatarFallback>
        </Avatar>
        <span>{group.name}</span>
      </div>
      <Button
        variant="destructive"
        size="icon"
        onClick={handleGroupDelete}
        disabled={loading}
      >
        <X />
      </Button>
    </div>
  );
}
