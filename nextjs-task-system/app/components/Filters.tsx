import React, { useState, useEffect } from "react";
import { Select } from "flowbite-react";
import { useSession } from "next-auth/react";
import { UserPartial } from "../types";
import { Group } from "@prisma/client";

const statusOptions = ["Pending", "InProgress", "Completed"];
const priorityOptions = ["High", "Medium", "Low"];

interface FiltersProps {
  onChangeUserId: (userId: string) => void;
  onChangeStatus: (status: string) => void;
  onChangePriority: (status: string) => void;
}

interface Option {
  id: string;
  name: string;
}

const Filters: React.FC<FiltersProps> = ({
  onChangeUserId,
  onChangeStatus,
  onChangePriority,
}) => {
  const [usersAndGroups, setUsersAndGroups] = useState<Option[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      try {
        const [responseUsers, responseGroups] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/groups"),
        ]);
        if (!responseUsers.ok) {
          throw new Error("Failed to fetch users");
        }
        if (!responseGroups.ok) {
          throw new Error("Failed to fetch groups");
        }
        const users: UserPartial[] = await responseUsers.json();
        const groups: Group[] = await responseGroups.json();

        const usersAndGroups = [
          ...groups.map((group) => ({
            id: `group,${group.id}`,
            name: group.name,
          })),
          ...users.map((user) => ({
            id: `user,${user.id}`,
            name: user.name,
          })),
        ];

        setUsersAndGroups(usersAndGroups);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsersAndGroups();
  }, []);

  const handleUserIdChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeUserId(event.target.value);
  };

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChangeStatus(event.target.value);
  };

  const handlePriorityChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    onChangePriority(event.target.value);
  };

  return (
    <div className="flex gap-4">
      {/* User Select */}
      {session?.user.role === "Admin" && (
        <Select
          id="user-group-select"
          onChange={handleUserIdChange}
          className="w-full md:w-auto md:min-w-24"
        >
          <option value="">All</option>
          {usersAndGroups.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </Select>
      )}

      {/* Status Select */}
      <Select
        id="status-select"
        onChange={handleStatusChange}
        className="w-full md:w-auto md:min-w-24"
      >
        <option value="">All status</option>
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </Select>

      {/* Priority Select */}
      <Select
        id="priority-select"
        onChange={handlePriorityChange}
        className="w-full md:w-auto md:min-w-24"
      >
        <option value="">All priority</option>
        {priorityOptions.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default Filters;
