import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { PriorityBadge, PriorityTask } from "./PriorityBadge";
import { AvatarGroup } from "./AvatarGroup";
import { TaskWithAssignments } from "../types";
import { TaskDueDate } from "./TaskDueDate";

interface TaskCardProps {
  task: TaskWithAssignments;
  index: number;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index, onClick }) => {
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="mb-2 flex-col rounded-lg border border-gray-200 bg-white p-3 shadow-md"
          style={{
            ...provided.draggableProps.style,
          }}
          onClick={onClick}
        >
          <h3>{task.title}</h3>
          <p className="pb-2 text-sm text-gray-600">{task.description}</p>
          <TaskDueDate dueDate={task.dueDate.toString()} />
          <div className="flex justify-between">
            <PriorityBadge priority={task.priority as PriorityTask} />
            <AvatarGroup assignments={task.assignments} />
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
