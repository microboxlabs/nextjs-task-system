"use client";

import FloatingButton from "@/components/FloatingButton";
import ProtectedRoute from "@/components/ProtectedRoutes";
import ConfirmDeleteModal from "@/components/tasks/ConfirmDelete";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CustomCardUser } from "@/components/users/Card";
import UserModal from "@/components/users/UserModal";

export default function UsersPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, []);

  const getUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (error) {}
  };

  const handleAddUser = async (newUser: User) => {
    try {
      await axios
        .post(
          "http://localhost:3000/api/users",
          newUser, //enviamos el objeto newTask
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          console.log("que recibe setUsers: " + JSON.stringify(newUser));
          setUsers([...users, newUser]);
          setIsModalOpen(false);
          alert("Usuario registrado exitosamente");
        });
    } catch (error) {
      console.log("Error al crear tarea:", error);
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
        {users.map((userr) => (
          <CustomCardUser
            user={user}
            token={token}
            usuario={userr}
            openDeleteModal={() => setTaskToDelete(userr.id!)}
          />
        ))}
      </div>
      {user?.role === "admin" && (
        <>
          <FloatingButton onPress={() => setIsModalOpen(true)} />
          <UserModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddUser}
          />
        </>
      )}

      {taskToDelete !== null && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={() => setTaskToDelete(null)} // Cierra el modal
          onConfirm={() => {
            deleteUser(taskToDelete); // Llama a la función de eliminación
            setTaskToDelete(null); // Resetea el estado
          }}
        />
      )}
    </ProtectedRoute>
  );
}
