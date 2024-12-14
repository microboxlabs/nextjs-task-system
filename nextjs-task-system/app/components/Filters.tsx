import React, { useState, useEffect } from "react";
import { Select, Button } from "flowbite-react";

interface FiltersProps {
  onChangeUserId: (userId: string) => void;
  onChangeStatus: (status: string) => void;
}

const Filters: React.FC<FiltersProps> = ({
  onChangeUserId,
  onChangeStatus,
}) => {
  const [users, setUsers] = useState<{ id: number; name: string }[]>([]);
  const [activeStatus, setActiveStatus] = useState<string>("All");

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

  const handleStatusClick = (status: string) => {
    setActiveStatus(status);
    onChangeStatus(status === "All" ? "" : status);
  };

  const statusOptions = ["All", "Pending", "InProgress", "Completed"];

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* User Select */}
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

      {/* Status Buttons */}
      <div className="flex gap-2">
        {statusOptions.map((status) => (
          <Button
            key={status}
            color={activeStatus === status ? undefined : "gray"}
            onClick={() => handleStatusClick(status)}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
