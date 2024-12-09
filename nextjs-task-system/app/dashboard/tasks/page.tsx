import Link from "next/link";
import Search from "./search";
import TableTask from "@/app/ui/tasks/Table";
import { fetchParams } from "@/app/lib/fetchParams";
import { PlusCircleIcon } from "lucide-react";

export default async function Tasks({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || "";

  const tasks = await fetchParams(query);

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 px-4 py-6 dark:bg-gray-900 md:py-8">
      {/* Encabezado */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          Task Management
        </h1>
        <Link
          href="/dashboard/tasks/create"
          className="flex w-32 items-center gap-1 rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
        >
          <PlusCircleIcon className="size-5" /> Add Task
        </Link>
      </div>

      {/* Búsqueda */}
      <div className="max-w-md">
        <Search placeholder="Search by name or group..." />
      </div>

      {/* Tabla de Tareas */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <TableTask tasks={tasks} />
      </div>
    </div>
  );
}
