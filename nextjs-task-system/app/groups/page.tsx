"use client";

import FloatingButton from "@/components/FloatingButton";
import ProtectedRoute from "@/components/ProtectedRoutes";
import ConfirmDeleteModal from "@/components/tasks/ConfirmDelete";
import { useAuth } from "@/context/AuthContext";
import { Group, User } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CustomCardUser } from "@/components/users/Card";
import UserModal from "@/components/users/UserModal";
import { CustomCardGroup } from "@/components/groups/Card";
import GroupModal from "@/components/groups/UserModal";

export default function UsersPage() {
  const { token, user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      getGroups();
    }
  }, []);

  const getGroups = async () => {
    try {
      await axios
        .get("http://localhost:3000/api/groups", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          if (response.data.groups.length === 0) {
            setGroups([]);
          } else {
            setGroups(response.data.groups);
          }
        })
        .catch((err) => console.log("error al obtener grupos: " + err));
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const handleAddGroup = async (newGroup: Group) => {
    console.log("que trae newGroup: " + JSON.stringify(newGroup));
    try {
      await axios
        .post(
          "http://localhost:3000/api/groups",
          newGroup, //enviamos el objeto newTask
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log("que recibe setGroups: " + JSON.stringify(newGroup));
          setGroups([...groups, newGroup]);
          setIsModalOpen(false);
          alert("Grupo registrado exitosamente");
        });
    } catch (error) {
      console.log("Error al crear grupo:", error);
    }
  };

  //eliminar tarea
  const deleteUser = async (id: number) => {
    /* try {
      await axios.delete("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id,
        },
      });
      console.log("tarea eliminada: " + id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setTaskToDelete(null);
    }*/
  };

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <CustomCardGroup
            user={user}
            token={token}
            group={group}
            openDeleteModal={() => setTaskToDelete(group.id!)}
          />
        ))}
      </div>
      {user?.role === "admin" && (
        <>
          <FloatingButton onPress={() => setIsModalOpen(true)} />
          <GroupModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddGroup}
          />
        </>
      )}

      {taskToDelete !== null && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={() => setTaskToDelete(null)}
          onConfirm={() => {
            deleteUser(taskToDelete); // Llama a la función de eliminación
            setTaskToDelete(null); // Resetea el estado
          }}
        />
      )}
    </ProtectedRoute>
  );
}
