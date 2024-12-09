"use client";
import { useState, useEffect } from "react";
import { Button, Select, Modal } from "flowbite-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  comments: string | null;
  priority: string;
  due_date: string;
  creator_name: string;
  assignee_name: string;
  created_at: string;
  updated_at: string;
}

export default function UserTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      router.push("/login");
    }
  };

  const fetchTasks = async () => {
    if (!currentUser) return;

    try {
      const response = await fetch(`/api/tasks/user/${currentUser.id}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const openModal = (task: Task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setNewComment(task.comments || "");
    setShowModal(true);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewStatus(e.target.value);
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(e.target.value);
  };

  const updateStatus = async () => {
    if (!selectedTask) return;

    try {
      const response = await fetch(`/api/tasks/${selectedTask.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          comments: newComment,
        }),
      });

      if (response.ok) {
        const updatedTask = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === selectedTask.id
              ? {
                  ...task,
                  status: updatedTask.status,
                  comments: updatedTask.comments,
                }
              : task,
          ),
        );
        setShowModal(false);
        setNewComment("");
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-orange-100 text-orange-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!currentUser) return <div>Loading...</div>;
  if (tasks.length === 0) return <div>No tasks found.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">My Tasks</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:bg-gray-800"
            onClick={() => openModal(task)}
          >
            <div className="mb-2 flex items-start justify-between">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                  task.priority,
                )}`}
              >
                {task.priority}
              </span>
            </div>
            <p className="mb-3 text-gray-600 dark:text-gray-300">
              {task.description}
            </p>
            <div className="flex flex-col space-y-2">
              <span
                className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                  task.status,
                )}`}
              >
                {task.status}
              </span>
              <p className="text-sm text-gray-500">
                Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
              </p>
              {task.comments && (
                <div className="mt-2 border-t pt-2 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Last comment:</span>{" "}
                    {task.comments}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="mt-8 text-center text-gray-500">No tasks found.</div>
      )}

      {selectedTask && (
        <Modal show={showModal} onClose={() => setShowModal(false)} size="xl">
          <Modal.Header>Edit Task</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 text-xl font-semibold">
                  {selectedTask.title}
                </h3>
                <p className="text-gray-600">{selectedTask.description}</p>
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Status
                </label>
                <Select
                  id="status"
                  value={newStatus}
                  onChange={handleStatusChange}
                  className="mb-4 w-full"
                >
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="comments"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Comments
                </label>
                <textarea
                  id="comments"
                  rows={4}
                  className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Add your comments here..."
                  value={newComment}
                  onChange={handleCommentChange}
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={updateStatus}>Update Task</Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}
