"use client";

import { useState } from "react";
import { Textarea, Button } from "flowbite-react";

interface CommentsSectionProps {
  comments: string[];
  onAddComment: (comment: string) => void;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment("");
    }
  };

  return (
    <div className="flex flex-col rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        Comments
      </h3>
      {comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No comments yet. Be the first to add a comment!
        </p>
      ) : (
        <div className="mb-4 flex flex-col gap-2">
          {comments.map((comment, index) => (
            <div
              key={index}
              className="rounded-md border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700"
            >
              {comment}
            </div>
          ))}
        </div>
      )}
      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Add a new comment..."
        className="mt-2 bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
        rows={3}
        aria-label="Add a new comment"
      />
      <Button
        onClick={handleAddComment}
        className="mt-2"
        disabled={!newComment.trim()}
      >
        Add Comment
      </Button>
    </div>
  );
};
