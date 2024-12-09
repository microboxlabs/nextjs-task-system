import React, { useState } from "react";
import { Card, Button, Modal } from "flowbite-react";
import { Task } from "@/tipos/tasks";
import { HiOutlineExclamationCircle } from "react-icons/hi";

interface TaskWithUserName extends Task {
  user_name?: string;
}

interface TaskCardProps {
  task: TaskWithUserName;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
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
      onDelete(task); // Notificar al componente padre
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Error deleting task");
    }
  };

  return (
    <>
      <Card key={task.id}>
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {task.title}
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          {task.description}
        </p>
        <p>
          <strong>Assigned to:</strong> {task.user_name || "Unassigned"}
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
          <Button color="blue" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button color="failure" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
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
