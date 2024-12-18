"use client";
import React, { FormEvent, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTaskContext } from "@/contexts/TaskContext";
import TaskCommentCreate from "./task-comment-create";
import TaskComment, { CommentSkeleton } from "./task-comment";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "@/components/ui/button";
export default function TaskDetails({
  taskId,
  open,
  onClose,
}: {
  taskId: string | undefined;
  open: boolean;
  onClose: () => void;
}) {
  const { getTaskComments, tasks, updateTaskStatus } = useTaskContext();
  const [loading, setLoading] = useState(true);
  const [doneLoading, setDoneLoading] = useState(false);
  const task = tasks.find((t) => t.id === taskId);

  function markAsDone() {
    if (!task) return;
    setDoneLoading(true);
    updateTaskStatus("FINISHED", task.id).finally(() => setDoneLoading(false));
  }

  useEffect(() => {
    if (!taskId || !task) return; // if it doesn't exist don't do anything
    if (task.comments) return;
    setLoading(true);
    getTaskComments(task.id).finally(() => setLoading(false));
  }, [task]);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Task Details: {task?.title}</DialogTitle>
          <DialogDescription>{task?.description}</DialogDescription>
        </DialogHeader>
        <TaskCommentCreate taskId={task?.id} />
        {/* TODO -> Comment rendering */}
        <ScrollArea className=" flex max-h-[40vh] flex-col-reverse overflow-y-auto transition-all duration-300 ease-in-out">
          {loading ? (
            <CommentSkeleton />
          ) : task?.comments && task.comments.length > 0 ? (
            task.comments.map((comment) => {
              return (
                <TaskComment
                  key={comment.id}
                  author={comment.user?.name!}
                  content={comment.content}
                  avatar={comment.user?.image!}
                  createdAt={`${comment.createdAt}`}
                />
              );
            })
          ) : (
            <p>No comments created yet</p>
          )}
        </ScrollArea>
        <DialogFooter className="flex border-t-2 pt-4">
          <Button
            onClick={markAsDone}
            disabled={doneLoading || task?.status === "FINISHED"}
          >
            Mark as done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
