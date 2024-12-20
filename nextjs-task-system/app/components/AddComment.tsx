import { Avatar, Button, Textarea, Tooltip } from "flowbite-react";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { CommentWithUser } from "../types";

interface AddCommentProps {
  taskId: number;
  onCommentAdded?: (comment: CommentWithUser) => void;
}

const AddComment: React.FC<AddCommentProps> = ({ taskId, onCommentAdded }) => {
  const { data: session } = useSession();
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error when adding a comment");
      }

      setContent("");
      if (onCommentAdded) {
        onCommentAdded(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pb-4">
      <div className="flex items-start gap-1">
        <Avatar
          img={getAvatarUrl(session?.user?.name || "nh")}
          rounded
          size="sm"
        ></Avatar>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment here..."
          rows={1}
          className="flex-1 rounded border p-2"
          disabled={isLoading}
        />
        <Button type="submit" disabled={!content.trim() || isLoading}>
          {isLoading ? "Adding..." : "Add"}
        </Button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </form>
  );
};

export default AddComment;
