import React, { useState } from "react";
import { Card, Button, Modal } from "flowbite-react";
import { Task } from "@/tipos/tasks";
import { HiOutlineExclamationCircle, HiUser } from "react-icons/hi";
import { format } from "date-fns";

interface TaskWithUserName extends Task {
  assignee_name?: string;
  creator_name?: string;
}

interface TaskCardProps {
  task: TaskWithUserName;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "in progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority.toLowerCase()) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setShowDeleteModal(false);
      onDelete(task);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  return (
    <>
      <Card key={task.id} className="relative">
        <div className="mb-2 flex items-start justify-between">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {task.title}
          </h5>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
              task.priority,
            )}`}
          >
            {task.priority}
          </span>
        </div>

        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {task.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                task.status,
              )}`}
            >
              {task.status}
            </span>
            <span className="text-sm text-gray-500">
              Due: {format(new Date(task.due_date), "MMM dd, yyyy")}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <HiUser className="h-4 w-4" />
            <span>Assigned to: {task.assignee_name || "Unassigned"}</span>
          </div>

          {task.comments && (
            <div className="border-t pt-2 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Last comment:</span>{" "}
                {task.comments}
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-2">
            <Button color="blue" size="sm" onClick={() => onEdit(task)}>
              Edit
            </Button>
            <Button
              color="failure"
              size="sm"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>

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
};

export default TaskCard;
