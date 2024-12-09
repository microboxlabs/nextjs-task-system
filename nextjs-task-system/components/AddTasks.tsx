"use client";

import { useTasks } from "@/context/TasksContext";
import { Button, Modal, TextInput, Textarea, Select } from "flowbite-react";
import { useEffect, useState } from "react";

type TaskData = {
  title: string;
  description: string;
  dueDate: string;
  priority: 'Low' | 'Medium' | 'High';
};

export function AddTasks() {
  const [openModal, setOpenModal] = useState(false);
  const [userSelect, setUserSelect] = useState([]);
  const [assignedToId, setAssignedToId] = useState<string>("");
  const [taskData, setTaskData] = useState<TaskData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
  });

  // Destructure addTask function from context to add a task
  const { addTask } = useTasks();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();

        setUserSelect(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const onCreateTask = async (taskData: TaskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          assignedToId: assignedToId, // Include the assigned user's ID to link the task
          dueDate: taskData.dueDate,
          priority: taskData.priority,
        }),
      });


      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong!');
      }

      // Call addTask to update the UI immediately after task creation. 
      // This avoids the need for a page refresh and improves user experience.
      addTask(data);

      alert('Task created successfully!');
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

  const handleAssignedToChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAssignedToId(e.target.value);
    console.log(assignedToId)
  };

  const handleSubmit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();


    if (!taskData.title || !taskData.description) {
      alert("Title, Description, and Assigned User are required!");
      return;
    }

    // Call the function to create the task
    if (onCreateTask) {
      onCreateTask(taskData);
    }

    // Reset form and close the modal
    setTaskData({
      title: "",
      description: "",
      dueDate: "",
      priority: "Medium", 
    });
    setAssignedToId("");
    setOpenModal(false);
  };

  return (
    <>
      <Button onClick={() => setOpenModal(true)} className="bg-gray-800">
        + Add Task
      </Button>
      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Add New Task</Modal.Header>
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
                value={assignedToId}
                onChange={handleAssignedToChange}
              >
                <option value="" disabled>Select a user</option>
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
          <Button onClick={handleSubmit}>Add Task</Button>
          <Button color="gray" onClick={() => setOpenModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
