"use client";
import { useState, useEffect } from "react";
import { Button, Select, Modal } from "flowbite-react";
import TaskCard from "@/components/TaskComponents/TaskCard";
import TaskCardSkeleton from "@/components/Skeletons/TaskCardSkeleton";
import { Task } from "@/tipos/tasks";
import { useRouter } from "next/navigation";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [priorityFilter, statusFilter, tasks]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/tasks");
      const data = await response.json();
      setTasks(data);
      setFilteredTasks(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let filtered = tasks;

    if (priorityFilter) {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    if (statusFilter) {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleTaskClick = (task: Task, action: "edit" | "delete") => {
    if (action === "edit") {
      router.push(`/admin/tasks/${task.id}`);
    } else if (action === "delete") {
      setTaskToDelete(task);
      setShowDeleteModal(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      const response = await fetch(`/api/tasks/${taskToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Actualizar la lista de tareas
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 mt-12 text-3xl font-bold md:mt-0">Tasks List</h1>

      {/* Filters and Create Button */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-x-4 sm:space-y-0">
        <div className="flex flex-1 space-x-4">
          <Select
            id="priorityFilter"
            name="priorityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="flex-1"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>

          <Select
            id="statusFilter"
            name="statusFilter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        <Button
          onClick={() => router.push("/admin/create")}
          className="w-full sm:w-auto"
          color="blue"
        >
          Create New Task
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? // Mostrar skeletons mientras carga
            Array.from({ length: 6 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))
          : filteredTasks.map((task) => (
              <div key={task.id}>
                <TaskCard
                  task={task}
                  onEdit={() => handleTaskClick(task, "edit")}
                  onDelete={() => handleTaskClick(task, "delete")}
                />
              </div>
            ))}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteConfirm}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {filteredTasks.length === 0 && (
        <div className="mt-8 text-center text-gray-500">
          No tasks found matching the selected filters.
        </div>
      )}
    </div>
  );
}
