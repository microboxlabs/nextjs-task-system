import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "../../ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TaskT } from "@/db/type";
import { useTaskContext } from "@/contexts/TaskContext";
import { updateTaskSchema } from "@/db/z-tasks";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";

export default function TaskEdit({
  task,
  open,
  onClose,
}: {
  task: TaskT | null;
  open: boolean;
  onClose: () => void;
}) {
  const { updateTask } = useTaskContext();
  const [taskInput, setTaskInputs] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: formatDate(task?.dueDate || new Date()),
  });

  const [loading, setLoading] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!task) return;
    setLoading(true);
    const parsedValues = updateTaskSchema.safeParse(taskInput);
    if (!parsedValues.data) {
      toast.error(parsedValues.error.errors[0].message);
      return setLoading(false);
    }
    updateTask(task.id, parsedValues.data)
      .then(() => {
        onClose();
      }) // if it's successfull close the input
      .catch(() => {
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setTaskInputs((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  }

  useEffect(() => {
    if (!task) return;
    setTaskInputs({
      title: task.title,
      description: task.description || "",
      dueDate: formatDate(task.dueDate),
    });
  }, [open, task]);

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update the task here, click save when you&apos;re done
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Title
                </Label>
                <Input
                  id="edit-name"
                  name="title"
                  disabled={loading}
                  value={taskInput.title}
                  className="col-span-3"
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  name="description"
                  id="edit-description"
                  className="col-span-3"
                  disabled={loading}
                  value={taskInput.description}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="due-date" className="text-right">
                  Due Date
                </Label>
                <Input
                  name="dueDate"
                  id="due-date"
                  className="col-span-3"
                  type="date"
                  disabled={loading}
                  min={formatDate(new Date())}
                  value={taskInput.dueDate}
                  onChange={handleChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
