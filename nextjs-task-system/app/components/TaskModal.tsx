import { Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { CommentWithUser, TaskWithAssignments } from "../types";
import { AvatarGroup } from "./AvatarGroup";
import { PriorityBadge, PriorityTask } from "./PriorityBadge";
import AddComment from "./AddComment";
import { TaskComments } from "./TaskComments";

interface TaskModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  task: TaskWithAssignments;
}

export function TaskModal({ openModal, setOpenModal, task }: TaskModalProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/tasks/${task.id}/comments`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || "Error al obtener los comentarios.",
          );
        }

        const data: CommentWithUser[] = await response.json();
        setComments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ocurrió un error.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [task.id]);

  const handleOnCommentAdded = (comment: CommentWithUser) => {
    setComments((comments) => [...comments, comment]);
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>{task.title}</Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <label className="text-xs dark:text-gray-300">Assigned to</label>
              <AvatarGroup assignments={task.assignments} />
            </div>
            <div>
              <label className="text-xs dark:text-gray-300">Priority</label>
              <PriorityBadge priority={task.priority as PriorityTask} />
            </div>
          </div>
          {task.description && (
            <div>
              <label className="text-xs dark:text-gray-300">Description</label>
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-50">
                {task.description}
              </p>
            </div>
          )}
          <div>
            <label className="block pb-4 text-xs dark:text-gray-300">
              Comments
            </label>
            <div>
              <AddComment
                taskId={task.id}
                onCommentAdded={handleOnCommentAdded}
              />
              <TaskComments
                comments={comments}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
