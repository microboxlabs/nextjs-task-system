import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { TaskDrag } from "../types";

interface TaskCardProps {
  task: TaskDrag;
  index: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
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
        >
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <p>
            <strong>Assigned To:</strong> {task.assignedTo}
          </p>
          <p>
            <strong>Due Date:</strong> {task.dueDate}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
