import React, { useEffect, useState } from "react";
import { useTasksStore } from "@/stores/tasksStore";
import { TaskStatus, Task } from "@/types/taskTypes";

export default function Home() {
  const {
    tasks,
    loading,
    error,
    getTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasksStore();

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending" as const,
    dueDate: "",
    assignedTo: "",
    priority: "low" as const,
    comments: [],
  });

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const handleCreateTask = async () => {
    if (newTask.title && newTask.description) {
      await createTask(newTask);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        dueDate: "",
        assignedTo: "",
        priority: "low",
        comments: [],
      });
    } else {
      alert("Title and description are required.");
    }
  };

  const handleUpdateTask = async (id: number, newStatus: TaskStatus) => {
    const updatedTask: Partial<Task> = { status: newStatus };
    await updateTask(id, updatedTask);
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4 dark:bg-gray-800">
      <h1 className="mb-4 text-2xl font-bold dark:text-white">
        Task Store Test
      </h1>

      {loading && <p className="dark:text-white">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mb-4">
        <button
          onClick={getTasks}
          className="mr-2 rounded-md bg-blue-500 px-4 py-2 text-white"
        >
          Fetch Tasks
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="mr-2 rounded-md border p-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="mr-2 rounded-md border p-2"
        />
        <button
          onClick={handleCreateTask}
          className="rounded-md bg-green-500 px-4 py-2 text-white"
        >
          Create Task
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="mb-2 rounded-md border p-2">
            <p className="dark:text-white">
              <strong>{task.title}</strong> - {task.status}
            </p>
            <button
              onClick={() => handleUpdateTask(task.id, "inProgress")}
              className="mr-2 rounded-md bg-yellow-500 px-4 py-2 text-white"
            >
              Update Task
            </button>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Delete Task
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
