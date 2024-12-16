import { Avatar } from "flowbite-react";
import { CommentWithUser } from "../types";
import { getAvatarUrl } from "../utils/getAvatarUrl";
import { TaskDueDate } from "./TaskDueDate";

interface TaskCommentsProps {
  comments: CommentWithUser[];
  isLoading: boolean;
  error: string | null;
}

export const TaskComments: React.FC<TaskCommentsProps> = ({
  comments,
  isLoading,
  error,
}) => {
  return (
    <>
      {isLoading && <p className="dark:text-gray-200">Loading comments...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {comments.length === 0 && !isLoading && (
        <p className="dark:text-gray-200">There is no comments yet.</p>
      )}
      <ul className="space-y-4">
        {comments.map((comment) => (
          <li key={comment.id} className="flex items-start gap-2">
            <Avatar
              img={getAvatarUrl(comment.user.name || "nh")}
              rounded
              size="sm"
              className="flex-shrink-0"
            />
            <div className="flex w-full flex-col justify-between gap-1">
              <div className="flex flex-wrap justify-between dark:text-gray-50 ">
                <p className="text-sm">{comment.user.name}</p>
                <TaskDueDate label="" dueDate={comment.createdAt.toString()} />
              </div>
              <p className="rounded border p-2 text-sm shadow-sm dark:border-gray-500 dark:text-gray-50">
                {comment.content}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};
