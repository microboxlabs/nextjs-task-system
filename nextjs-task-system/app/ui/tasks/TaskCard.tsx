import React, { useState } from "react";
import { Clock, MessageCircle, CheckCircle, Loader } from "lucide-react";
import { Task, TaskStatus } from "@/app/lib/definitions";
import { updateTaskComments, updateTaskStatus } from "@/app/lib/tasksServices";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task) => void;
}

const statusIcons = {
  pending: <Clock className="text-yellow-500" />,
  "in progress": <Loader className="text-blue-500" />,
  completed: <CheckCircle className="text-green-500" />,
};

export function TaskCard({ task, onStatusChange }: TaskCardProps) {
  const [comment, setComment] = useState("");

  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);

  const handleStatusChange = async () => {
    const statusOrder: TaskStatus[] = ["pending", "in progress", "completed"];
    const nextStatus =
      statusOrder[(statusOrder.indexOf(task.status) + 1) % statusOrder.length];

    try {
      const { updatedTask } = await updateTaskStatus(task.id, nextStatus);
      onStatusChange(updatedTask);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const { updatedTask } = await updateTaskComments(task.id, comment);
      onStatusChange(updatedTask);
      setComment("");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const priorityColors = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-red-100 text-red-800",
  };

  return (
    <div className="relative rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
        <button
          onClick={handleStatusChange}
          className="absolute right-4 top-4 flex items-center gap-2 rounded  px-3 py-1 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={task.status === "completed"}
        >
          {statusIcons[task.status]}
        </button>
      </div>

      <p className="mb-4 text-gray-600">{task.description}</p>

      {/* Fecha límite */}
      <div className="mb-4 flex items-center text-gray-500">
        <Clock className="mr-2 size-4" />
        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      {/* Comentarios */}
      <div>
        <div
          className="flex cursor-pointer items-center gap-2 text-gray-500"
          onClick={() => setIsCommentFormVisible(!isCommentFormVisible)}
        >
          <MessageCircle className="size-5" />
          <span>{task.comments.length} Comments</span>
        </div>

        {/* Formulario condicional */}
        {isCommentFormVisible && (
          <div className="mt-4">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full resize-none rounded border border-gray-300 p-1 focus:border-indigo-500 focus:ring focus:ring-indigo-200"
              />
            </form>

            {/* Lista de comentarios */}
            <ul className="mt-4 space-y-2">
              {task.comments.map((c, idx) => (
                <li
                  key={idx}
                  className="rounded bg-gray-100 p-2 text-gray-800 shadow-sm"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <span
        className={`rounded-full px-3 py-1 text-sm font-medium capitalize ${priorityColors[task.priority]}`}
      >
        {task.priority}
      </span>
    </div>
  );
}
