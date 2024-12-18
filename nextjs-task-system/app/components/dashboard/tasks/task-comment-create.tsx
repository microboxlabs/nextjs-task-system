import React, { FormEvent, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "../../ui/textarea";
import { DialogFooter } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { useTaskContext } from "@/contexts/TaskContext";

export default function TaskCommentCreate({
  taskId,
}: {
  taskId: string | undefined;
}) {
  const { createComment } = useTaskContext();
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    if (!taskId) return;
    if (comment.trim() === "") return toast.error("Comment is required");
    createComment(taskId, comment).finally(() => {
      setLoading(false);
    });
  }
  return (
    <form onSubmit={handleSubmit}>
      <Label htmlFor="task-comment">Add a comment</Label>
      <Textarea
        placeholder="There's an issue with..."
        onChange={(e) => setComment(e.target.value)}
        name="comment"
        value={comment}
        id="task-comment"
      />
      <DialogFooter className="mt-4">
        <Button type="submit" disabled={loading}>
          Save changes
        </Button>
      </DialogFooter>
    </form>
  );
}
