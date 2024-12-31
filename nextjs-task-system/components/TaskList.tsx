import { Task } from "@/types/taskTypes";
import { Card, CustomFlowbiteTheme } from "flowbite-react";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  title: string;
  tasks: Task[];
}

const customCardTheme: CustomFlowbiteTheme["card"] = {
  root: {
    children: "flex h-full flex-col justify-center gap-4 p-4 md:p-6",
  },
};

export function TaskList({ title, tasks }: TaskListProps) {
  return (
    <Card theme={customCardTheme} className="flex h-full flex-1 flex-col">
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="flex flex-1 flex-col gap-2 lg:gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} />)
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No tasks available.
          </p>
        )}
      </div>
    </Card>
  );
}
