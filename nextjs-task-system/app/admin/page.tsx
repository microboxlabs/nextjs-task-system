"use client";
import { useState, useEffect } from "react";
import { Button, Modal, Select } from "flowbite-react";
import TaskCard from "@/components/TaskComponents/TaskCard";
import { Task } from "@/tipos/tasks";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  first_name: string;
  last_name: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [priorityFilter, statusFilter, tasks]);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data);
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

  const handleDelete = async () => {
    if (taskToDelete) {
      await fetch(`/api/tasks?id=${taskToDelete.id}`, { method: "DELETE" });
      setTaskToDelete(null);
      setIsDeleteModalOpen(false);
      fetchTasks();
    }
  };

  const openDeleteModal = (task: Task) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 mt-12 text-3xl font-bold md:mt-0">
        Task Management Dashboard
      </h1>
      <Button
        onClick={() => router.push("/admin/create")}
        className="mb-4 bg-blue-500"
      >
        Create New Task
      </Button>

      {/* Filters */}
      <div className="mb-4 flex space-x-4">
        <Select
          id="priorityFilter"
          name="priorityFilter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
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
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={() => router.push(`/admin/edit/${task.id}`)}
            onDelete={openDeleteModal}
          />
        ))}
      </div>

      {/* Confirmation Modal for Deleting Task */}
      <Modal
        show={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <Modal.Header>Confirm Delete</Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the task "{taskToDelete?.title}"?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="failure" onClick={handleDelete}>
            Confirm
          </Button>
          <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
