"use client";
import { useState, useEffect, use } from "react";
import {
  Button,
  Label,
  TextInput,
  Textarea,
  Select,
  Modal,
} from "flowbite-react";
import { useRouter } from "next/navigation";
import { Task } from "@/tipos/tasks";
import { HiOutlineExclamationCircle, HiCheck, HiX } from "react-icons/hi";

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditTask({ params }: PageProps) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.id;
  const [task, setTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
    if (taskId) {
      fetchTask();
    }
  }, [taskId]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch task");
      }
      const data = await response.json();
      setTask(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching task:", error);
      router.push("/admin/tasks");
    }
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
    setShowUpdateModal(true);
  };

  const confirmUpdate = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setShowUpdateModal(false);
      setShowSuccessModal(true);

      // Redirect after success modal is closed
      setTimeout(() => {
        router.push("/admin/tasks");
        router.refresh();
      }, 2000);
    } catch (error) {
      setShowUpdateModal(false);
      setErrorMessage(
        error instanceof Error ? error.message : "An error occurred",
      );
      setShowErrorModal(true);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setShowDeleteModal(false);
      router.push("/admin/tasks");
      router.refresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  if (!task) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto p-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 mt-12 text-3xl font-bold md:mt-0">Edit Task</h1>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-lg bg-white p-6 shadow-md"
          >
            <div>
              <Label htmlFor="title">Title</Label>
              <TextInput
                id="title"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Select
                id="assigned_to"
                name="assigned_to"
                value={formData.assigned_to || ""}
                onChange={handleInputChange}
                required
              >
                <option value="">Select user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </Select>
            </div>

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

            <div>
              <Label htmlFor="comments">Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                value={formData.comments || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button onClick={() => router.push("/admin/tasks")} color="gray">
                Cancel
              </Button>
              <Button type="submit" color="blue">
                Update Task
              </Button>
              <Button
                type="button"
                color="failure"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Task
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Update Confirmation Modal */}
      <Modal
        show={showUpdateModal}
        size="md"
        onClose={() => setShowUpdateModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to update this task?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="blue" onClick={confirmUpdate}>
                Yes, update
              </Button>
              <Button color="gray" onClick={() => setShowUpdateModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal
        show={showSuccessModal}
        size="md"
        onClose={() => setShowSuccessModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiCheck className="mx-auto mb-4 h-14 w-14 text-green-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Task updated successfully!
            </h3>
            <div className="flex justify-center">
              <Button color="gray" onClick={() => setShowSuccessModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Error Modal */}
      <Modal
        show={showErrorModal}
        size="md"
        onClose={() => setShowErrorModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiX className="mx-auto mb-4 h-14 w-14 text-red-500" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Error updating task
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {errorMessage}
            </p>
            <div className="mt-4 flex justify-center">
              <Button color="gray" onClick={() => setShowErrorModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        size="md"
        onClose={() => setShowDeleteModal(false)}
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this task?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDelete}>
                Yes, delete
              </Button>
              <Button color="gray" onClick={() => setShowDeleteModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
