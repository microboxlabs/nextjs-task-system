"use client";

import { Group, User } from "@/types";
import axios from "axios";
import { Card } from "flowbite-react";
import { useState } from "react";
import { FaTrash } from "react-icons/fa";

export function CustomCardGroup({
  group,
  token,
  user,
  openDeleteModal,
}: {
  group: Group;
  token: string | null;
  user: User | undefined;
  openDeleteModal: () => void;
}) {
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
        {group.name}
      </h5>
    </Card>
  );
}
