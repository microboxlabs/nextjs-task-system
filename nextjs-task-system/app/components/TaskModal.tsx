import {
  Button,
  Label,
  Modal,
  Popover,
  Select,
  Textarea,
  TextInput,
  Tooltip,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import { CommentWithUser, TaskWithAssignments } from "../types";
import { AvatarGroup } from "./AvatarGroup";
import { PriorityBadge, PriorityTask } from "./PriorityBadge";
import AddComment from "./AddComment";
import { TaskComments } from "./TaskComments";
import OutsideClickDetector from "./OutsideClickDetector";

interface TaskModalProps {
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
  task: TaskWithAssignments;
  updateTaskField: (
    field: keyof TaskWithAssignments,
  ) => (value: string) => void;
  deleteTask: () => void;
}

export function TaskModal({
  openModal,
  setOpenModal,
  task,
  updateTaskField,
  deleteTask,
}: TaskModalProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdateTitle, setIsUpdateTitle] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [isUpdateDescription, setIsUpdateDescription] = useState(false);
  const [description, setDescription] = useState(task.description);

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
      <Modal.Header>
        {isUpdateTitle ? (
          <OutsideClickDetector
            onOutsideClick={() => {
              setIsUpdateTitle(false);
              if (task.title !== title) {
                updateTaskField("title")(title);
              }
            }}
          >
            <TextInput
              onChange={(e) => setTitle(e.currentTarget.value)}
              value={title}
              className="w-full py-0 text-base"
            />
          </OutsideClickDetector>
        ) : (
          <button
            className={title ? "" : "text-gray-400"}
            onClick={() => {
              setIsUpdateTitle(true);
            }}
          >
            {title || "Edit title"}
          </button>
        )}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <div className="flex justify-between">
            <div>
              <label className="text-xs dark:text-gray-300">Assigned to</label>
              <AvatarGroup assignments={task.assignments} />
            </div>
            <div className="flex flex-col">
              <label className="text-xs dark:text-gray-300">Priority</label>
              <Popover
                aria-labelledby="default-popover"
                content={
                  <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                    <div className="px-3 py-2">
                      <Label htmlFor="priority">Priority</Label>
                      <Select
                        id="priority"
                        className="select select-bordered w-full pb-4"
                        value={task.priority}
                        onChange={(e) =>
                          updateTaskField("priority")(e.target.value)
                        }
                      >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                      </Select>
                    </div>
                  </div>
                }
              >
                <button>
                  <PriorityBadge priority={task.priority as PriorityTask} />
                </button>
              </Popover>
            </div>
          </div>
          {task.description && (
            <div className="flex flex-col">
              <label className="text-xs dark:text-gray-300">Description</label>
              {isUpdateDescription ? (
                <OutsideClickDetector
                  onOutsideClick={() => {
                    setIsUpdateDescription(false);
                    if (task.description !== description) {
                      updateTaskField("description")(description);
                    }
                  }}
                >
                  <Textarea
                    onChange={(e) => setDescription(e.currentTarget.value)}
                    value={description}
                    className="w-full"
                  />
                </OutsideClickDetector>
              ) : (
                <button
                  onClick={() => {
                    setIsUpdateDescription(true);
                  }}
                >
                  <p className="text-left text-sm leading-relaxed text-gray-500 dark:text-gray-50">
                    {description || "Add a description"}
                  </p>
                </button>
              )}
            </div>
          )}
          <div>
            <div className="flex items-end justify-between pb-4">
              <label className="block text-xs dark:text-gray-300">
                Comments
              </label>
              <Tooltip content="Delete Task">
                <Button
                  className="h-8 w-8 rounded-full p-0"
                  size="sm"
                  color="failure"
                  onClick={deleteTask}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="currentColor"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </Button>
              </Tooltip>
            </div>
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
