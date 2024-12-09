"use client";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { Task } from "@/app/lib/definitions";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { deleteTask } from "@/app/lib/fetchParams";

export default function TableTask({ tasks }: { tasks: Task[] }) {
  const [sortedTasks, setSortedTasks] = useState<Task[]>(tasks);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Task | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const sortTasks = (key: keyof Task) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });

    const sorted = [...tasks].sort((a, b) => {
      if (a[key]! < b[key]!) return direction === "asc" ? -1 : 1;
      if (a[key]! > b[key]!) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortedTasks(sorted);
  };

  useEffect(() => {
    setSortedTasks(tasks);
  }, [tasks]);

  return (
    <Table striped>
      <TableHead>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Assigned To</TableHeadCell>
        <TableHeadCell
          onClick={() => sortTasks("creationDate")}
          className="flex items-center gap-1"
        >
          Creation Date{" "}
          {sortConfig.key === "creationDate" ? (
            sortConfig.direction === "asc" ? (
              <ArrowUp className="w-4" />
            ) : (
              <ArrowDown className="w-4" />
            )
          ) : null}
        </TableHeadCell>
        <TableHeadCell onClick={() => sortTasks("dueDate")}>
          Due Date
          {sortConfig.key === "dueDate" ? (
            sortConfig.direction === "asc" ? (
              <ArrowUp className="w-4" />
            ) : (
              <ArrowDown className="w-4" />
            )
          ) : null}
        </TableHeadCell>
        <TableHeadCell onClick={() => sortTasks("priority")}>
          Priority
          {sortConfig.key === "priority" ? (
            sortConfig.direction === "asc" ? (
              <ArrowUp className="w-4" />
            ) : (
              <ArrowDown className="w-4" />
            )
          ) : null}
        </TableHeadCell>
        <TableHeadCell>Status</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Edit</span>
        </TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {sortedTasks.map((task: Task) => (
          <TableRow
            key={task.id}
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.assignedTo.name}</TableCell>
            <TableCell>{task.creationDate}</TableCell>
            <TableCell>{task.dueDate}</TableCell>
            <TableCell>{task.priority}</TableCell>
            <TableCell>{task.status}</TableCell>
            <TableCell>
              <Link
                href={`/dashboard/tasks/create?id=${task.id}`}
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                Edit
              </Link>
            </TableCell>
            <TableCell>
              <button
                onClick={() => deleteTask(task.id)}
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                Delete
              </button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
