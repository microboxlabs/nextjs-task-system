"use client";
import React, { useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";
import { BoardData } from "../types";

const initialData: BoardData = {
  columns: {
    Pending: {
      name: "Pending",
      tasks: [
        {
          id: 1,
          title: "Task 1",
          description: "Details of task 1",
          assignedTo: "User A",
          dueDate: "2024-12-15",
          priority: "High",
        },
        {
          id: 2,
          title: "Task 2",
          description: "Details of task 2",
          assignedTo: "User B",
          dueDate: "2024-12-20",
          priority: "Medium",
        },
        {
          id: 3,
          title: "Task 3",
          description: "Details of task 2",
          assignedTo: "User B",
          dueDate: "2024-12-20",
          priority: "Medium",
        },
      ],
    },
    "In Progress": {
      name: "In Progress",
      tasks: [],
    },
    Completed: {
      name: "Completed",
      tasks: [],
    },
  },
};

const TaskBoard: React.FC = () => {
  const [data, setData] = useState<BoardData>(initialData);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = data.columns[source.droppableId];
    const destinationColumn = data.columns[destination.droppableId];

    const sourceTasks = [...sourceColumn.tasks];
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceTasks.splice(destination.index, 0, movedTask);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
        },
      });
    } else {
      const destinationTasks = [...destinationColumn.tasks];
      destinationTasks.splice(destination.index, 0, movedTask);

      setData({
        ...data,
        columns: {
          ...data.columns,
          [source.droppableId]: { ...sourceColumn, tasks: sourceTasks },
          [destination.droppableId]: {
            ...destinationColumn,
            tasks: destinationTasks,
          },
        },
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
        {Object.entries(data.columns).map(([columnId, column]) => (
          <TaskColumn key={columnId} columnId={columnId} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
