"use client";
import { useState, useEffect } from "react";
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

interface User {
  id: number;
  first_name: string;
  last_name: string;
}

export default function CreateTask() {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Automatically set user_id when assigned_to changes
    if (name === "assigned_to") {
      setFormData((prev) => ({ ...prev, user_id: value }));
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requiredFields = [
      "title",
      "description",
      "assigned_to",
      "due_date",
      "priority",
      "status",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof Task]) {
        setErrorMessage(`Please fill out the ${field} field.`);
        setShowErrorModal(true);
        return;
      }
    }

    const selectedDate = new Date(formData.due_date as string);
    const today = new Date(getCurrentDate());

    if (selectedDate < today) {
      setErrorMessage("Due date cannot be earlier than today.");
      setShowErrorModal(true);
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    setShowSuccessModal(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 mt-12 text-3xl font-bold md:mt-0">
          Create New Task
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-lg bg-white p-6 shadow-md"
        >
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
              <option value="">Select user</option>
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
              min={getCurrentDate()}
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
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="completed">Completed</option>
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
          <div className="flex justify-end" color="blue">
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>

      {/* Error Modal */}
      <Modal show={showErrorModal} onClose={() => setShowErrorModal(false)}>
        <Modal.Header>Error</Modal.Header>
        <Modal.Body>
          <p className="text-red-500">{errorMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button color="gray" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Modal */}
      <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
        <Modal.Header>Confirm Task Creation</Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to create this task?</p>
          <div className="mt-4">
            <p>
              <strong>Due Date:</strong> {formData.due_date}
            </p>
            <p>
              <strong>Title:</strong> {formData.title}
            </p>
            <p>
              <strong>Priority:</strong> {formData.priority}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={confirmSubmit}>Yes, Create</Button>
          <Button color="gray" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)}>
        <Modal.Header>Task Created</Modal.Header>
        <Modal.Body>
          <p>Task created successfully!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => router.push("/admin")}>OK</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
