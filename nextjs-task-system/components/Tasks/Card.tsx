"use client";

import { Task, User } from "@/types";
import axios from "axios";
import { Card } from "flowbite-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import TaskDetails from "./TaskDetails";

export function CustomCard({
  task,
  token,
  user,
  openDeleteModal,
}: {
  task: Task;
  token: string | null;
  user: User | undefined;
  openDeleteModal: () => void;
}) {
  const [isOpenDetail, setisOpenDetail] = useState(false); //abrir modal detalles tarea

  //cambiar estado de tarea
  const handleStatusChange = async (e: any, taskId: number) => {
    const newStatus = e.target.value;

    try {
      await axios.patch(
        `http://localhost:3000/api/tasks`,
        {
          taskId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(`Estado actualizado a: ${newStatus}`);
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  return (
    <Card className="relative max-w-sm rounded-lg bg-white p-5 shadow-lg dark:bg-gray-800">
      {user?.role === "admin" && (
        <button
          className="absolute right-2 top-2 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
          onClick={openDeleteModal}
          title="Eliminar"
        >
          <FaTrash size={16} />
        </button>
      )}
      <h5 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        {task.title}
      </h5>
      <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
        {task.description}
      </p>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Prioridad:{" "}
          <span
            className={`${
              task.priority === "Alta"
                ? "text-red-500"
                : task.priority === "Media"
                  ? "text-yellow-500"
                  : "text-green-500"
            }`}
          >
            {task.priority}
          </span>
        </p>

        <hr className="my-2 border-gray-300 dark:border-gray-600" />

        {user?.role !== "admin" && (
          <>
            <label
              htmlFor={`status-${task.id}`}
              className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              Estado:
            </label>
            <select
              id={`status-${task.id}`}
              className="block w-full rounded-md border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:ring-blue-500"
              defaultValue={task.status || "Pendiente"}
              onChange={(e) => handleStatusChange(e, task.id!)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
            </select>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="rounded-md bg-blue-500 px-3 py-1.5 text-xs text-white hover:bg-blue-600 focus:outline-none"
          onClick={() => setisOpenDetail(true)}
        >
          Ver Detalles
        </button>
        {user?.role === "admin" && (
          <span
            className={`text-xs font-semibold ${
              task.status === "Completada"
                ? "text-green-500"
                : task.status === "En Proceso"
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {task.status}
          </span>
        )}
      </div>

      <TaskDetails
        task={task}
        isOpen={isOpenDetail}
        onClose={() => setisOpenDetail(false)}
      />
    </Card>
  );
}
