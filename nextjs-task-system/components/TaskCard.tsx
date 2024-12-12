import { Task } from "@/types/taskTypes";
import { Card, CustomFlowbiteTheme } from "flowbite-react";
import {
  HiChevronDoubleUp,
  HiMenuAlt4,
  HiChevronDoubleDown,
} from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";

interface TaskCardProps {
  task: Task;
}

const customCardTheme: CustomFlowbiteTheme["card"] = {
  root: {
    children: "flex h-full flex-col justify-center gap-4 p-3 md:p-4",
  },
};

const formatDate = (date: string) => {
  return format(new Date(date), "d MMM");
};

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const getPriorityIcon = () => {
    switch (task.priority) {
      case "high":
        return <HiChevronDoubleUp className="text-red-500" />;
      case "medium":
        return <HiMenuAlt4 className="text-yellow-500" />;
      case "low":
        return <HiChevronDoubleDown className="text-green-500" />;
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
            {task.dueDate && (
              <span className="truncate">{formatDate(task.dueDate)}</span>
            )}
          </div>

          {task.assignedTo && (
            <div className="flex items-center gap-2 truncate">
              <FaUser className="ml-2" />
              <span className="truncate">{task.assignedTo}</span>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
