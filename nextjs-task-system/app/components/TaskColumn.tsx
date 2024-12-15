import React from "react";
import { Droppable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";
import { Column } from "../types";

interface TaskColumnProps {
  columnId: string;
  column: Column;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ columnId, column }) => {
  return (
    <Droppable droppableId={columnId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="min-h-[400px] w-[320px] rounded-lg bg-gray-100 p-2.5"
        >
          <h2 className="pb-4 text-center font-semibold">{column.name}</h2>
          {column.tasks.map((task, index) => (
            <TaskCard key={task.id} task={task} index={index} />
          ))}

          {/* visual snapshot*/}
          {snapshot.isDraggingOver && (
            <div className="mb-2.5 flex h-[80px] rounded-lg bg-gray-200"></div>
          )}

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TaskColumn;
