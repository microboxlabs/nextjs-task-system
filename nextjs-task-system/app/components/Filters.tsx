import React, { useState, useEffect } from "react";
import { Select, Button } from "flowbite-react";
import { useSession } from "next-auth/react";

const statusOptions = ["Pending", "InProgress", "Completed"];
const priorityOptions = ["High", "Medium", "Low"];

interface FiltersProps {
  onChangeUserId: (userId: string) => void;
  onChangeStatus: (status: string) => void;
  onChangePriority: (status: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  onChangeUserId,
  onChangeStatus,
  onChangePriority,
}) => {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
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
          id="user-select"
          onChange={handleUserIdChange}
          className="w-full md:w-auto md:min-w-24"
        >
          <option value="">All users</option>
          {users.map((user) => (
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
