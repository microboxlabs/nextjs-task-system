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
  const [isOpenDetail, setisOpenDetail] = useState(false);

  // Cambiar estado de tarea
  const handleStatusChange = async (
    e: any,
    taskId: number,
    isComment: boolean,
  ) => {
    const status = isComment ? null : e.target.value;

    try {
      await axios.patch(
        `http://localhost:3000/api/tasks`,
        {
          taskId,
          status,
          comments: isComment ? e : null,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log(
        `${isComment ? "Comentario" : "status"} se cambio a ${isComment ? e : status}`,
      );
    } catch (error) {
      console.error("Error al actualizar el estado:", error);
    }
  };

  return (
    <Card className="relative max-w-xs rounded-lg bg-gradient-to-r from-indigo-50 to-white p-4 shadow-md dark:from-gray-800 dark:to-gray-900">
      {user?.role === "admin" && (
        <button
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-700 dark:hover:text-white"
          onClick={(e) => {
            e.stopPropagation(); // Evitar abrir el modal al hacer clic en el botón
            openDeleteModal();
          }}
          title="Eliminar"
        >
          <FaTrash size={18} />
        </button>
      )}

      <div className="flex flex-col items-start space-y-2">
        <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
          {task.title}
        </h5>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {task.description}
        </p>
      </div>

      <div className="my-4">
        <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Prioridad:{" "}
          <span
            className={`${
              task.priority === "Alta"
                ? "text-red-500"
                : task.priority === "Media"
                  ? "text-yellow-500"
                  : "text-green-500"
            } font-semibold`}
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
              onChange={(e) => handleStatusChange(e, task.id!, false)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En Proceso">En Proceso</option>
              <option value="Completada">Completada</option>
            </select>
          </>
        )}
      </div>

      {/* Separar el status del botón para admins */}
      {user?.role === "admin" && (
        <div className="mb-4 mt-4">
          <span
            className={`text-sm font-semibold ${
              task.status === "Completada"
                ? "text-green-500"
                : task.status === "En Proceso"
                  ? "text-yellow-500"
                  : "text-red-500"
            }`}
          >
            {task.status}
          </span>
        </div>
      )}

      <div className="mt-4">
        {/* Botón para ver detalles */}
        <button
          className="w-full rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setisOpenDetail(true)}
        >
          Ver Detalle
        </button>
      </div>

      <TaskDetails
        task={task}
        isOpen={isOpenDetail}
        onClose={() => setisOpenDetail(false)}
        user={user!}
        onCommentSubmit={(comment) =>
          handleStatusChange(comment, task.id!, true)
        }
      />
    </Card>
  );
}
