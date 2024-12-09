"use client";

import { useState, useEffect } from "react";
import { TaskList } from "./TaskList";
import { TaskForm } from "./TaskForm";

interface User {
  id: number;
  email: string;
}

interface Group {
  id: number;
  name: string;
}

interface TaskManagerProps {
  tasks: any[]; // Tareas filtradas desde el AdminPage
  onAddTask: (task: any) => Promise<void>; // Función para añadir tareas
  onUpdateTask: (taskId: number, task: any) => Promise<void>; // Función para actualizar tareas
  onDeleteTask: (taskId: number) => Promise<void>; // Función para eliminar tareas
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [editTask, setEditTask] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      setLoading(true);
      try {
        const [usersResponse, groupsResponse] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/groups"),
        ]);

        if (!usersResponse.ok || !groupsResponse.ok) {
          throw new Error("Failed to fetch users or groups");
        }

        const usersData = await usersResponse.json();
        const groupsData = await groupsResponse.json();
        setUsers(usersData);
        setGroups(groupsData);
      } catch (err) {
        console.error("Error fetching users/groups:", err);
        setError("Failed to load users and groups.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndGroups();
  }, []);

  const handleEdit = (task: any) => {
    setEditTask(task);
    setShowForm(true);
  };

  const handleDelete = async (taskId: number) => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await onDeleteTask(taskId);
      } catch (err) {
        console.error("Error deleting task:", err);
        setError("Failed to delete task. Please try again.");
      }
    }
  };

  const handleSubmitTask = async (task: any) => {
    try {
      if (task.id) {
        await onUpdateTask(task.id, task);
      } else {
        await onAddTask(task);
      }
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting task:", err);
      setError("Failed to submit task. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div>
      <button
        onClick={() => {
          setEditTask(null);
          setShowForm(true);
        }}
        className="mb-4 rounded bg-blue-500 px-4 py-2 text-white"
        aria-label="Create new task"
      >
        Create Task
      </button>

      <TaskList
        key={tasks.length}
        tasks={tasks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {showForm && (
        <TaskForm
          initialData={editTask}
          users={users}
          groups={groups}
          onClose={() => setShowForm(false)}
          onSubmit={handleSubmitTask}
        />
      )}
    </div>
  );
};
