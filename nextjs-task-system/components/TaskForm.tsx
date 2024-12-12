"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTasksStore } from "@/stores/tasksStore";
import { priorityOptions } from "@/utils/taskConstants";
import { Label, TextInput, Textarea, Select, Button } from "flowbite-react";
import { TaskPriority } from "@/types/taskTypes";

export function TaskForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const { createTask, loading, error } = useTasksStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create a new task using the provided store function
      await createTask({
        title,
        description,
        assignedTo,
        dueDate,
        priority,
        comments: [],
        status: "pending", // Set the initial status to "pending"
      });

      // Redirect to the dashboard upon successful task creation
      router.push("/dashboard");
    } catch (err) {
      // Handle any errors that occur during task creation
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="w-full max-w-md ">
      <h2 className="mb-2 text-2xl font-semibold text-gray-900 dark:text-white md:mb-4">
        Create Task
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <div className="mb-2 block">
            <Label htmlFor="title" value="Title" />
          </div>
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="description" value="Description" />
          </div>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="assignedTo" value="Assigned To" />
          </div>
          <TextInput
            id="assignedTo"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="dueDate" value="Due Date" />
          </div>

          <TextInput
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <div className="mb-2 block">
            <Label htmlFor="priority" value="Priority" />
          </div>
          <Select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            {Object.values(priorityOptions).map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </form>
    </div>
  );
}
