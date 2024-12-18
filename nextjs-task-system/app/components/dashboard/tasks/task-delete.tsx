"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TaskT } from "@/db/type";
import { useTaskContext } from "@/contexts/TaskContext";

export default function TaskDelete({
  task,
  open,
  onClose,
}: {
  task: TaskT | null;
  open: boolean;
  onClose: () => void;
}) {
  const { deleteTask } = useTaskContext();
  const [loading, setLoading] = useState(false);
  function handleDelete() {
    if (!task) return;
    setLoading(true);
    deleteTask(task.id)
      .then(() => onClose())
      .finally(() => setLoading(false));
  }
  return (
    <>
      <Dialog onOpenChange={onClose} open={open}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the task{" "}
              <b>{task?.title || ""}</b>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary" disabled={loading}>
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
