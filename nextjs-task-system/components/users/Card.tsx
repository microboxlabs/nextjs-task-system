"use client";

import { User } from "@/types";
import axios from "axios";
import { Card } from "flowbite-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export function CustomCardUser({
  usuario,
  token,
  user,
  openDeleteModal,
}: {
  usuario: User;
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
          id: taskId,
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
        {usuario.username}
      </h5>
      <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
        {usuario.role}
      </p>
    </Card>
  );
}
