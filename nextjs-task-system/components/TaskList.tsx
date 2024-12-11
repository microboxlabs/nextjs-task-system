"use client";

import { Card } from "flowbite-react";

interface TaskListProps {
  title: string;
}

export default function TaskList({ title }: TaskListProps) {
  return (
    <Card className="flex flex-1 flex-col">
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
        {title}
      </h3>
      <div className="flex-1 space-y-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          No tasks available.
        </p>
      </div>
    </Card>
  );
}
