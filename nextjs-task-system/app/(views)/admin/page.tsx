"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { TaskManager } from "../../components/tasks/TaskManager";
import { useTaskStore } from "../../store/taskStore";

export default function AdminPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, filterTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: undefined as "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined,
    priority: undefined as "Low" | "Medium" | "High" | undefined,
  });

  
  useEffect(() => {
    const fetchAdminTasks = async () => {
      if (user?.role !== "ADMIN") return;

      try {
        setLoading(true);
        setError(null);
        await fetchTasks(undefined, undefined, true); 
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminTasks();
  }, [user?.role, fetchTasks]);

  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };


  const handleAddTask = async (newTaskData: any) => {
    try {
      setLoading(true);
      await addTask(newTaskData);
    } catch (err) {
      console.error("Error adding task:", err);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTask = async (taskId: number, updatedFields: any) => {
    try {
      setLoading(true);
      await updateTask(taskId, updatedFields);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm(`Are you sure you want to delete task #${taskId}?`)) {
      return; 
    }

    try {
      setLoading(true);
      await deleteTask(taskId);
      alert(`Task #${taskId} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">
          Access denied. You do not have the necessary permissions.
        </p>
      </div>
    );
  }

  const filteredTasks = filterTasks(filters);

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Admin Dashboard</h1>

      
      {loading && <p>Loading tasks...</p>}
      {error && <p className="text-red-500">{error}</p>}

     
      {!loading && !error && (
        <>

          <section className="mb-8">
            <h2 className="mb-4 text-xl font-semibold">Filter and Sort Tasks</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <select
                name="status"
                value={filters.status || ""}
                onChange={handleFilterChange}
                className="rounded border border-gray-300 p-2"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
              <select
                name="priority"
                value={filters.priority || ""}
                onChange={handleFilterChange}
                className="rounded border border-gray-300 p-2"
                aria-label="Filter by priority"
              >
                <option value="">All Priorities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </section>


          <section>
            <h2 className="mb-4 text-xl font-semibold">Manage Tasks</h2>
            <TaskManager
              tasks={filteredTasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </section>
        </>
      )}
    </div>
  );
}
