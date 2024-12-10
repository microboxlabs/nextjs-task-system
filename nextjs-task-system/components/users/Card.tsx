"use client";

import { User } from "@/types";
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
  const [isOpenDetail, setisOpenDetail] = useState(false);

  return (
    <Card
      className="relative max-w-sm cursor-pointer rounded-xl bg-gradient-to-r from-green-50 to-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg dark:from-gray-800 dark:to-gray-900"
      onClick={() => setisOpenDetail(true)}
    >
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
          {usuario.username}
        </h5>
        <p className="text-sm capitalize text-gray-600 dark:text-gray-400">
          Rol: {usuario.role}
        </p>
      </div>
    </Card>
  );
}
