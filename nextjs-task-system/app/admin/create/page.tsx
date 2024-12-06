"use client";
import { useState } from "react";
import { Button, Label, TextInput, Textarea, Select } from "flowbite-react";
import { useRouter } from "next/navigation";
import { Task } from "@/tipos/tasks";

export default function CreateTask() {
  const [formData, setFormData] = useState<Partial<Task>>({});
  const router = useRouter();

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
        alert(`Please fill out the ${field} field.`);
        return;
      }
    }

    const confirmSubmit = confirm("Are you sure you want to create this task?");
    if (!confirmSubmit) return;

    await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    alert("Task created successfully!");
    router.push("/admin");
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
            <TextInput
              id="assigned_to"
              name="assigned_to"
              value={formData.assigned_to || ""}
              onChange={handleInputChange}
              placeholder="Enter user ID"
              required
            />
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
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
