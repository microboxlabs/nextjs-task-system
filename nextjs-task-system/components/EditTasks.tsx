"use client";

import { useTasks } from "@/context/TasksContext";
import { Button, Modal, TextInput, Textarea, Select } from "flowbite-react";
import { useEffect, useState } from "react";

type TaskData = {
  id: string; 
  title: string;
  description: string;
  dueDate: string;
  priority: "Low" | "Medium" | "High";
};

type EditTasksProps = {
  task: TaskData;
  setEditModalOpen: (open: boolean) => void; 
};

export function EditTasks({ task, setEditModalOpen }: EditTasksProps) {
  const [userSelect, setUserSelect] = useState([]);
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [taskData, setTaskData] = useState<TaskData>(task);
  const { updateTask } = useTasks();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();

        setUserSelect(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  // Handle form submission and validate required fields
  const onUpdateTask = async (taskData: TaskData) => {
    try {
      const response = await fetch(`/api/tasks/${taskData.id}`, {
        method: "PUT", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          assignedToId: assignedToId, // Pass the selected user ID
          dueDate: taskData.dueDate,
          priority: taskData.priority,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Something went wrong!");
      }

      updateTask(data); 
      alert("Task updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle change for the assigned user dropdown
  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignedToId(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskData.title || !taskData.description) {
      alert("Title, Description, and Assigned User are required!");
      return;
    }

    onUpdateTask(taskData);

    setEditModalOpen(false);
  };

  return (
    <>
      <Modal.Header>Edit Task</Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Task Title
            </label>
            <TextInput
              name="title"
              value={taskData.title}
              onChange={handleInputChange}
              id="title"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Task Description
            </label>
            <Textarea
              name="description"
              value={taskData.description}
              onChange={handleInputChange}
              id="description"
              placeholder="Enter task description"
              required
            />
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <TextInput
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleInputChange}
              id="dueDate"
              type="date"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <Select
              name="priority"
              value={taskData.priority}
              onChange={handleInputChange}
              id="priority"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </Select>
          </div>

          <div>
            <label htmlFor="assignedToId" className="block text-sm font-medium text-gray-700">
              Assigned To
            </label>
            <Select
              name="assignedToId"
              value={assignedToId || task.assignedToId}
              onChange={handleAssignedToChange}
            >
              <option value="" disabled>
                Select a user
              </option>
              {userSelect.map((user: { id: string; name: string }) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </Select>
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleSubmit}>Update Task</Button>
        <Button color="gray" onClick={() => setEditModalOpen(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </>
  );
}
