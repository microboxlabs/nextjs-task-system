"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { TaskManager } from "../../components/tasks/TaskManager";
import { useTaskStore } from "../../store/taskStore";

export default function AdminPage() {
  const { user } = useAuthStore();
  const { tasks, fetchTasks, filterTasks, addTask, updateTask, deleteTask, fetchGroups } = useTaskStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: undefined as "PENDING" | "IN_PROGRESS" | "COMPLETED" | undefined,
    priority: undefined as "Low" | "Medium" | "High" | undefined,
    assignedTo: undefined as string | undefined,
    group: undefined as string | undefined,
  });
  const [groups, setGroups] = useState<{ id: number; name: string }[]>([]); // Lista de grupos

  useEffect(() => {
    const fetchAdminTasksAndGroups = async () => {
      if (user?.role !== "ADMIN") return;

      try {
        setLoading(true);
        setError(null);
        await fetchTasks(undefined, undefined, true); // Fetch tasks for admin
        const fetchedGroups = await fetchGroups(); // Fetch groups
        setGroups(fetchedGroups);
      } catch (err) {
        console.error("Error fetching tasks or groups:", err);
        setError("Failed to load tasks or groups. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminTasksAndGroups();
  }, [user?.role, fetchTasks, fetchGroups]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value || undefined,
    }));
  };

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
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
              <select
  name="assignedTo"
  value={filters.assignedTo || ""}
  onChange={handleFilterChange}
  className="rounded border border-gray-300 p-2"
  aria-label="Filter by assigned user"
>
  <option value="">All Assignees</option>
  <option value="unassigned">Unassigned</option>
  {[...new Set(tasks.map((task) => task.user?.email).filter(Boolean))].map(
    (email) => (
      <option key={email} value={email}>
        {email}
      </option>
    )
  )}
</select>

              <select
                name="group"
                value={filters.group || ""}
                onChange={handleFilterChange}
                className="rounded border border-gray-300 p-2"
                aria-label="Filter by group"
              >
                <option value="">All Groups</option>
                {groups.map((g) => (
                  <option key={g.id} value={g?.name}>
                    {g?.name}
                  </option>
                ))}
              </select>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-xl font-semibold">Manage Tasks</h2>
            <TaskManager
              tasks={filteredTasks}
              onAddTask={addTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </section>
        </>
      )}
    </div>
  );
}
