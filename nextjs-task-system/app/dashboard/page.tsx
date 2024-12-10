"use client";

import { CustomCard } from "@/components/tasks/Card";
import FloatingButton from "@/components/FloatingButton";
import ProtectedRoute from "@/components/ProtectedRoutes";
import ConfirmDeleteModal from "@/components/tasks/ConfirmDelete";
import TaskModal from "@/components/tasks/TaskModal";
import { useAuth } from "@/context/AuthContext";
import { Task } from "@/types";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Filtrado from "@/components/tasks/Filtrado";
import { useSSE } from "@/hooks/useSSE";
import useNotification from "@/hooks/useNotifications";

export default function Dashboard() {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  // Filtros
  const [filterState, setFilterState] = useState<string>("Todos");
  const [filterUser, setFilterUser] = useState<string>("");
  const [filterPriority, setFilterPriority] = useState<string>("Todos");
  const [sortOrder, setSortOrder] = useState<string>("");
  const { requestPermission } = useNotification();

  useEffect(() => {
    requestPermission();
  }, []);

  //=======================================================================================

  const data = useSSE("http://localhost:3000/api/refresh");
  console.log("que trae sse: " + JSON.stringify(data));

  //=================================================================================0
  useEffect(() => {
    if (data) {
      setTasks(data); // Sincroniza el estado local con las tareas actualizadas desde SSE
    }
  }, [data]);

  useEffect(() => {
    if (token) {
      getTasks();
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filterState, filterUser, filterPriority, tasks]);

  useEffect(() => {
    sortTasks();
  }, [sortOrder, filteredTasks]);

  const getTasks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error("Error al obtener tareas:", error);
    }
  };

  const applyFilters = () => {
    let result = tasks;

    // Filtrar por estado
    if (filterState !== "Todos") {
      result = result.filter((task) => task.status === filterState);
    }

    // Filtrar por prioridad
    if (filterPriority !== "Todos") {
      result = result.filter((task) => task.priority === filterPriority);
    }

    // Filtrar por usuario asignado
    if (filterUser.trim() !== "") {
      result = result.filter((task) =>
        task.assigned_name?.toLowerCase().includes(filterUser.toLowerCase()),
      );
    }

    setFilteredTasks(result);
  };

  //Ordenar tareas
  const sortTasks = () => {
    // Evitar ordenamientos innecesarios si el valor de sortOrder no cambia
    if (!sortOrder) return;

    // Crear una copia de las tareas filtradas
    let sortedTasks = [...filteredTasks];

    // Ordenar por fecha de vencimiento
    if (sortOrder === "due_date") {
      sortedTasks.sort((a, b) => {
        if (a.due_date && b.due_date) {
          return (
            new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
          );
        }
        return 0;
      });
    }
    // Ordenar por fecha de creación
    else if (sortOrder === "created_date") {
      sortedTasks.sort((a, b) => {
        if (a.created_date && b.created_date) {
          return (
            new Date(a.created_date).getTime() -
            new Date(b.created_date).getTime()
          );
        }
        return 0;
      });
    }
    // Ordenar por prioridad
    else if (sortOrder === "priority") {
      const priorityOrder: { [key in "Alta" | "Media" | "Baja"]: number } = {
        Alta: 3,
        Media: 2,
        Baja: 1,
      };

      sortedTasks.sort(
        (a, b) =>
          priorityOrder[b.priority as "Alta" | "Media" | "Baja"] -
          priorityOrder[a.priority as "Alta" | "Media" | "Baja"],
      );
    }

    // Solo actualizar el estado si las tareas realmente cambian
    setFilteredTasks((prevTasks) => {
      if (JSON.stringify(prevTasks) !== JSON.stringify(sortedTasks)) {
        return sortedTasks;
      }
      return prevTasks; // Si no hay cambios, no actualices el estado
    });
  };

  const handleAddTask = async (newTask: Task) => {
    try {
      await axios
        .post("http://localhost:3000/api/tasks", newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { assigned_name } = response.data;

          const completeTask: Task = {
            ...newTask,
            assigned_name,
          };

          setTasks([...tasks, completeTask]);
          setIsModalOpen(false);
          alert("Tarea registrada exitosamente");
        })
        .catch((err) => console.log("error al crear la tarea!!: " + err));
    } catch (error) {
      console.error("Error al crear tarea:", error);
    }
  };

  const handleUpdateTask = async (newTask: Task) => {
    try {
      await axios
        .put("http://localhost:3000/api/tasks", newTask, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Actualizar la lista de tareas localmente
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task.id === newTask.id ? newTask : task)),
          );
          //  setIsModalOpen(false);
          alert("Tarea actualizada exitosamente");
        });
    } catch (error) {
      console.error("Error al updatear tarea:", error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      await axios.delete("http://localhost:3000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id },
      });

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error(error);
    } finally {
      setTaskToDelete(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="p-4">
        <Filtrado
          filterState={filterState}
          filterUser={filterUser}
          filterPriority={filterPriority}
          setFilterState={setFilterState}
          setFilterUser={setFilterUser}
          setFilterPriority={setFilterPriority}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {/* Tarjetas */}
        <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredTasks.map((task, index) => (
            <CustomCard
              key={task.id}
              task={task}
              token={token}
              user={user}
              openDeleteModal={() => setTaskToDelete(task.id!)}
              updateTask={handleUpdateTask}
            />
          ))}
        </div>

        {/* Botón flotante y modales */}
        {user?.role === "admin" && (
          <>
            <FloatingButton onPress={() => setIsModalOpen(true)} />
            <TaskModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleAddTask}
              task={null}
            />
          </>
        )}

        {taskToDelete !== null && (
          <ConfirmDeleteModal
            isOpen={true}
            onClose={() => setTaskToDelete(null)}
            onConfirm={() => {
              deleteTask(taskToDelete);
              setTaskToDelete(null);
            }}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
