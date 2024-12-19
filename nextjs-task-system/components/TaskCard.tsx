"use client";

import { Task } from "@/types/taskTypes";
import { Card, CustomFlowbiteTheme } from "flowbite-react";
import {
  HiChevronDoubleUp,
  HiMenuAlt4,
  HiChevronDoubleDown,
} from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { format, parseISO } from "date-fns";
import Link from "next/link";
import { useUsersStore } from "@/stores/usersStore";
import { getAssignedName } from "@/utils/taskUtils";
import { useEffect } from "react";

interface TaskCardProps {
  task: Task;
}

const customCardTheme: CustomFlowbiteTheme["card"] = {
  root: {
    children: "flex h-full flex-col justify-center gap-4 p-3 md:p-4",
  },
};

const formatDate = (date: string) => {
  const parsedDate = parseISO(date);
  return format(parsedDate, "d MMM");
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { users, getUsers } = useUsersStore();

  useEffect(() => {
    if (users.length === 0) {
      getUsers();
    }
  }, [users, getUsers]);

  const assignedName = task.assignedTo
    ? getAssignedName(task.assignedTo, users)
    : "Unassigned";

  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high":
        return (
          <HiChevronDoubleUp
            className="text-red-500"
            aria-label="High priority"
          />
        );
      case "medium":
        return (
          <HiMenuAlt4
            className="text-yellow-500"
            aria-label="Medium priority"
          />
        );
      case "low":
        return (
          <HiChevronDoubleDown
            className="text-green-500"
            aria-label="Low priority"
          />
        );
      default:
        return null;
    }
  };

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card theme={customCardTheme}>
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
          {task.title}
        </h4>

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {getPriorityIcon()}
            {task.dueDate ? (
              formatDate(task.dueDate)
            ) : (
              <span className="italic text-gray-500">No due date</span>
            )}
          </div>

          <div className="flex items-center gap-2 truncate">
            <FaUser className="ml-2" />
            <span className="truncate">{assignedName}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
