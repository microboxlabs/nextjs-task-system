"use client";

import { CustomCard } from "@/components/Card";
import FloatingButton from "@/components/FloatingButton";
import ProtectedRoute from "@/components/ProtectedRoutes";
import ConfirmDeleteModal from "@/components/Tasks/ConfirmDelete";
import TaskModal from "@/components/Tasks/TaskModal";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (token) {
      getTasks();
    }
  }, []);

  const getTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
    } catch (error) {}
  };

  const handleAddTask = async (newTask: Task) => {
    try {
      await axios
        .post(
          "http://localhost:3000/api/tasks",
          newTask, //enviamos el objeto newTask
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        .then((res) => {
          setIsModalOpen(false);
          alert("Tarea registrada exitosamente");
          console.log("que recibe setTasks: " + JSON.stringify(res.data));
          setTasks([...tasks, newTask]);
        });
    } catch (error) {
      console.log("Error al crear tarea:", error);
    }
  };

  //eliminar tarea
  const deleteTask = async (id: number) => {
    try {
      await axios.delete("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id,
        },
      });
      console.log("tarea eliminada: " + id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    } finally {
      setTaskToDelete(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="grid grid-cols-1 gap-1 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <CustomCard
            task={task}
            token={token}
            user={user}
            openDeleteModal={() => setTaskToDelete(task.id!)}
          />
        ))}
      </div>
      {user?.role === "admin" && (
        <>
          <FloatingButton onPress={() => setIsModalOpen(true)} />
          <TaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTask}
          />
        </>
      )}

      {taskToDelete !== null && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={() => setTaskToDelete(null)} // Cierra el modal
          onConfirm={() => {
            deleteTask(taskToDelete); // Llama a la función de eliminación
            setTaskToDelete(null); // Resetea el estado
          }}
        />
      )}
    </ProtectedRoute>
  );
}
