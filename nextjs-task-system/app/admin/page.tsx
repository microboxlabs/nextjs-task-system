"use client";
import { useState, useEffect } from "react";
import {
  Card,
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Modal,
} from "flowbite-react";

type Task = {
  id: number;
  title: string;
  description: string;
  assigned_to: number;
  due_date: string;
  priority: string;
  status: string;
  comments?: string;
};

type User = {
  id: number;
  first_name: string;
  last_name: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data);
  };

  const fetchUsers = async () => {
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = currentTask ? `/api/tasks?id=${currentTask.id}` : "/api/tasks";
    const method = currentTask ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setIsModalOpen(false);
    setCurrentTask(null);
    setFormData({});
    fetchTasks();
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

  const openModal = (task?: Task) => {
    if (task) {
      setCurrentTask(task);
      setFormData(task);
    } else {
      setCurrentTask(null);
      setFormData({});
    }
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 mt-12 text-3xl font-bold md:mt-0">
        Task Management Dashboard
      </h1>
      <Button onClick={() => openModal()} className="mb-4">
        Add New Task
      </Button>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <Card key={task.id}>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {task.title}
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {task.description}
            </p>
            <p>
              <strong>Assigned to:</strong> {task.assigned_to}
            </p>
            <p>
              <strong>Due Date:</strong> {task.due_date}
            </p>
            <p>
              <strong>Priority:</strong> {task.priority}
            </p>
            <p>
              <strong>Status:</strong> {task.status}
            </p>
            {task.comments && (
              <p>
                <strong>Comments:</strong> {task.comments}
              </p>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <Button color="warning" onClick={() => openModal(task)}>
                Edit
              </Button>
              <Button color="failure" onClick={() => openDeleteModal(task)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal for Adding/Editing Task */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Modal.Header>
          {currentTask ? "Edit Task" : "Add New Task"}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Enter task title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Enter task description"
                required
              />
            </div>

            {/* Assigned To */}
            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Select
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Due Date */}
            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <TextInput
                id="due_date"
                name="due_date"
                type="date"
                value={formData.due_date || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Priority */}
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                name="priority"
                value={formData.priority || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Select>
            </div>

            {/* Status */}
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                name="status"
                value={formData.status || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </div>

            {/* Comments */}
            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments || ""}
                onChange={handleInputChange}
                placeholder="Add comments (optional)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit">
                {currentTask ? "Update Task" : "Create Task"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

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
