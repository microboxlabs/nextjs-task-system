import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { Task } from "@/app/lib/definitions";
import { fetchParams } from "@/app/lib/fetchParams";

export default async function TableTask({ query }: { query: string }) {
  const tasks = await fetchParams(query);

  return (
    <Table striped>
      <TableHead>
        <TableHeadCell>Title</TableHeadCell>
        <TableHeadCell>Description</TableHeadCell>
        <TableHeadCell>Assigned To</TableHeadCell>
        <TableHeadCell>Due Date</TableHeadCell>
        <TableHeadCell>Priority</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Edit</span>
        </TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {tasks.map((task: Task) => (
          <TableRow
            key={task.id}
            className="bg-white dark:border-gray-700 dark:bg-gray-800"
          >
            <TableCell>{task.title}</TableCell>
            <TableCell>{task.description}</TableCell>
            <TableCell>{task.assignedTo.name}</TableCell>
            <TableCell>{task.dueDate}</TableCell>
            <TableCell>{task.priority}</TableCell>
            <TableCell>
              <Link
                href={`/dashboard/tasks/${task.id}/edit`}
                className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
              >
                Edit
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
