import React from "react";
import TaskCard from "./TaskCard";
import { TaskCommentData as CommentData } from "../../store/taskStore";

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  user: {
    email: string;
  } | null;
  group: {
    name: string;
  } | null;
  comments: CommentData[];
}

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => Promise<void>;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEdit,
  onDelete,
}) => {
  const [activeTaskId, setActiveTaskId] = React.useState<number | null>(null);
  const [commentContent, setCommentContent] = React.useState<string>("");

  const handleCommentChange = (content: string) => {
    setCommentContent(content);
  };

  const handleCommentSubmit = (taskId: number) => {
    if (!commentContent.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    console.log("Comment submitted for task ID:", taskId, "Content:", commentContent);
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Task List</h2>
      {tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              isActive={activeTaskId === task.id}
              isRegularUser={false} // Esto puede ser dinámico si tienes roles
              onActivate={() => setActiveTaskId(task.id === activeTaskId ? null : task.id)}
              onAddComment={() => handleCommentSubmit(task.id)}
              commentContent={commentContent}
              onCommentChange={handleCommentChange}
              onEdit={() => onEdit(task)}
              onDelete={() => onDelete(task.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No tasks available.</p>
      )}
    </div>
  );
};




