"use client";

import { Group, User } from "@/types";
import { Card } from "flowbite-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";
import GroupDetails from "./GroupDetails";

export function CustomCardGroup({
  group,
  user,
  openDeleteModal,
}: {
  group: Group;
  token: string | null;
  user: User | undefined;
  openDeleteModal: () => void;
}) {
  const [isOpenDetail, setisOpenDetail] = useState(false);
  console.log("card group: " + JSON.stringify(group));
  return (
    <Card
      className="relative max-w-sm cursor-pointer rounded-xl bg-gradient-to-r from-indigo-50 to-white p-6 shadow-md transition-transform hover:scale-105 hover:shadow-lg dark:from-gray-800 dark:to-gray-900"
      onClick={() => setisOpenDetail(true)}
    >
      {user?.role === "admin" && (
        <button
          className="absolute right-4 top-4 rounded-full p-2 text-gray-500 hover:bg-red-100 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-700 dark:hover:text-white"
          onClick={(e) => {
            e.stopPropagation(); // Evitar que se abra el modal al hacer clic en el botón
            openDeleteModal();
          }}
          title="Eliminar"
        >
          <FaTrash size={18} />
        </button>
      )}

      <div className="flex flex-col items-start space-y-2">
        <h5 className="text-xl font-semibold text-gray-900 dark:text-white">
          {group.name}
        </h5>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Miembros:{" "}
          {group.users
            ? group.users.length
            : group.user_ids
              ? group.user_ids.length
              : 0}
        </p>
      </div>

      <GroupDetails
        group={group}
        isOpen={isOpenDetail}
        onClose={() => setisOpenDetail(false)}
      />
    </Card>
  );
}
