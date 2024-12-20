import React from "react";
import { Avatar, Tooltip } from "flowbite-react";
import { Assignment } from "../types";
import { getAvatarUrl } from "../utils/getAvatarUrl";

interface AvatarGroupProps {
  assignments: Assignment[];
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ assignments }) => {
  return (
    <Avatar.Group>
      {assignments.map((assignment) => (
        <Tooltip
          key={assignment.user?.id || assignment.group?.id}
          content={
            <div className="space-y-1 font-medium">
              <div>{assignment.user?.name || assignment.group?.name}</div>
              {assignment.user && (
                <div className="text-sm text-gray-300">
                  {assignment.user.email}
                </div>
              )}
            </div>
          }
        >
          <Avatar
            img={getAvatarUrl(
              assignment.user?.name || assignment.group?.name || "nh",
            )}
            rounded
            size="sm"
          ></Avatar>
        </Tooltip>
      ))}
    </Avatar.Group>
  );
};
