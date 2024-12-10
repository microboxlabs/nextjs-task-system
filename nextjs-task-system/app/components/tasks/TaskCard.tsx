"use client";

import React, { useState } from "react";
import { Button } from "flowbite-react";
import { TaskCommentData as CommentData } from "../../store/taskStore";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  priority: string;
  user: {
    email: string;
  } | null;
  group: {
    name: string;
  } | null;
  comments?: CommentData[];
}

interface TaskCardProps {
  task: Task;
  isActive: boolean;
  isRegularUser: boolean;
  onActivate: () => void;
  onAddComment?: () => void;
  commentContent: string;
  onCommentChange: (content: string) => void;
  onEdit: (taskId: number) => Promise<void>;
  onDelete?: () => void;
  onUpdateStatus?: (taskId: number, newStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  isActive,
  isRegularUser,
  onActivate,
  onAddComment,
  commentContent,
  onCommentChange,
  onEdit,
  onDelete,
  onUpdateStatus,
}) => {
  const comments = task.comments || [];
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = async () => {
    setIsUpdating(true);
    try {
      await onEdit(task.id);
    } catch (error) {
      console.error("Error updating task:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="rounded-md border p-4 shadow">
      <h3 className="text-lg font-bold">{task.title}</h3>
      <p>{task.description}</p>
      <p className="text-sm text-gray-500">
        Due Date: {new Date(task.dueDate).toLocaleDateString()}
      </p>
      <p>Status: {task.status}</p>
      <p className="text-sm text-gray-500">
        Assigned To: {task.user?.email || "Unassigned"}
      </p>
      <p className="text-sm text-gray-500">
        Group: {task.group?.name || "No group"}
      </p>
      <p>Priority: {task.priority}</p>

      {/* Change Status: For regular users */}
      {isRegularUser && onUpdateStatus && (
        <div className="mt-4">
          <label
            htmlFor={`status-${task.id}`}
            className="block text-sm font-medium text-gray-700"
          >
            Change Status:
          </label>
          <select
            id={`status-${task.id}`}
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="PENDING">Pending</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      )}

      {/* Comments Section */}
      <CommentList comments={comments} />

      {/* Add Comment Button: For regular users */}
      {isRegularUser && (
        <>
          <Button size="sm" onClick={onActivate} className="mt-4">
            {isActive ? "Close Comment" : "Add Comment"}
          </Button>
          {isActive && (
            <div className="mt-4">
              <textarea
                value={commentContent}
                onChange={(e) => onCommentChange(e.target.value)}
                className="w-full rounded border p-2"
                placeholder="Write your comment here..."
              ></textarea>
              <Button
                size="sm"
                onClick={onAddComment}
                className="mt-2"
                disabled={!commentContent.trim()}
              >
                Submit
              </Button>
            </div>
          )}
        </>
      )}

      <div className="mt-4 flex justify-between">
        {/* Edit Button: Visible only for admins */}
        {!isRegularUser && (
          <Button size="sm" onClick={handleEditClick} disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Edit"}
          </Button>
        )}
        {onDelete && (
          <Button size="sm" color="red" onClick={onDelete}>
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};

const CommentList: React.FC<{ comments: CommentData[] }> = ({ comments }) => (
  <ul className="mt-2">
    <h4 className="font-bold">Comments:</h4>
    {comments.length > 0 ? (
      comments.map((comment, index) => (
        <li key={`${comment.id}-${index}`} className="text-sm">
          <span className="font-semibold">{comment.user?.email || "Unknown"}:</span> {comment.content}
        </li>
      ))
    ) : (
      <p className="text-sm text-gray-500">No comments yet.</p>
    )}
  </ul>
);

export default TaskCard;
