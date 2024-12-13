"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";
import { BoardData } from "../types";
import { Task } from "@prisma/client";

type TaskStatus = "Pending" | "InProgress" | "Completed";

const initialData: BoardData = {
  columns: {
    Pending: {
      name: "Pending",
      tasks: [
        /*         {
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
        }, */
      ],
    },
    InProgress: {
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const tasks: Task[] = await response.json();
        console.log(tasks, "tasks<");

        const { Pending, InProgress, Completed } = tasks.reduce(
          (colums, task) => {
            colums[task.status as TaskStatus] = [
              ...colums[task.status as TaskStatus],
              task,
            ];
            return colums;
          },
          { Pending: [], InProgress: [], Completed: [] } as {
            Pending: Task[];
            InProgress: Task[];
            Completed: Task[];
          },
        );
        const data = { ...initialData };
        data.columns["Pending"] = {
          ...data.columns["[Pending"],
          tasks: Pending,
        };
        data.columns["InProgress"] = {
          ...data.columns["[InProgress"],
          tasks: InProgress,
        };
        data.columns["Completed"] = {
          ...data.columns["[Completed"],
          tasks: Completed,
        };
        setData(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

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
      <div className="flex justify-center gap-5">
        {Object.entries(data.columns).map(([columnId, column]) => (
          <TaskColumn key={columnId} columnId={columnId} column={column} />
        ))}
      </div>
    </DragDropContext>
  );
};

export default TaskBoard;
