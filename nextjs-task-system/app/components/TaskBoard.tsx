"use client";
import React, { useEffect, useState } from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import TaskColumn from "./TaskColumn";
import { BoardData, TaskStatus, TaskWithAssignments } from "../types";
import Filters from "./Filters";
import Sort from "./Sort";
import { useSession } from "next-auth/react";
import { TaskModal } from "./TaskModal";

const initialData: BoardData = {
  columns: {
    Pending: {
      name: "Pending",
      tasks: [],
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
  const { data: session, status } = useSession();
  const [data, setData] = useState<BoardData>(initialData);
  const [filters, setFilters] = useState({
    status: "",
    userIdOrGroupId: "",
    priority: "",
  });
  const [sort, setSort] = useState({
    sortBy: "createdAt",
    direction: "desc",
  });
  const [openModal, setOpenModal] = useState(false);
  const [workingTask, setWorkingTask] = useState<TaskWithAssignments | null>(
    null,
  );

  const fetchTasks = async () => {
    try {
      if (session === null || !session?.user) return;
      const queryParams = new URLSearchParams();

      if (filters.userIdOrGroupId)
        queryParams.append("userIdOrGroupId", filters.userIdOrGroupId);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.priority) queryParams.append("priority", filters.priority);
      if (sort.sortBy) queryParams.append("sortBy", sort.sortBy);
      if (sort.direction) queryParams.append("direction", sort.direction);

      const response = await fetch(`/api/tasks?${queryParams}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const tasks: TaskWithAssignments[] = await response.json();

      const { Pending, InProgress, Completed } = tasks.reduce(
        (columns, task) => {
          columns[task.status as TaskStatus] = [
            ...columns[task.status as TaskStatus],
            task,
          ];
          return columns;
        },
        { Pending: [], InProgress: [], Completed: [] } as {
          Pending: TaskWithAssignments[];
          InProgress: TaskWithAssignments[];
          Completed: TaskWithAssignments[];
        },
      );

      const updatedData = { ...initialData };
      updatedData.columns["Pending"] = {
        name: initialData.columns["Pending"].name,
        tasks: Pending,
      };
      updatedData.columns["InProgress"] = {
        name: initialData.columns["InProgress"].name,
        tasks: InProgress,
      };
      updatedData.columns["Completed"] = {
        name: initialData.columns["Completed"].name,
        tasks: Completed,
      };

      setData(updatedData);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters, sort, status]);

  const updateTaskStatus = async (
    taskId: number,
    newStatus: string,
  ): Promise<void> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      throw new Error("Failed to update task status");
    }
  };

  const updateTaskField =
    (key: keyof TaskWithAssignments) => async (value: string) => {
      await updateTask({ [key]: value });
    };

  const updateTask = async (task: Partial<TaskWithAssignments>) => {
    try {
      if (workingTask === null) return;
      const status = workingTask.status as TaskStatus;
      const response = await fetch(`/api/tasks/${workingTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
      const updatedColumnTasks = data.columns[status].tasks.map((t) =>
        t.id === workingTask.id ? { ...t, ...task } : t,
      );
      setWorkingTask({ ...workingTask, ...task });
      setData({
        ...data,
        columns: {
          ...data.columns,
          [status]: { name: status, tasks: updatedColumnTasks },
        },
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  };

  const onDragEnd = async (result: DropResult): Promise<void> => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumn = data.columns[source.droppableId as TaskStatus];
    const destinationColumn =
      data.columns[destination.droppableId as TaskStatus];

    const sourceTasks = [...sourceColumn.tasks];
    let [movedTask] = sourceTasks.splice(source.index, 1);

    try {
      if (movedTask.status !== destination.droppableId) {
        // only if status changed
        await updateTaskStatus(movedTask.id, destination.droppableId);
        movedTask.status = destination.droppableId;
      }

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
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleUserIdChange = (userIdOrGroupId: string) => {
    setFilters((prev) => ({ ...prev, userIdOrGroupId }));
  };

  const handleStatusChange = (status: string) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handlePriorityChange = (priority: string) => {
    setFilters((prev) => ({ ...prev, priority }));
  };

  const handleSortChange = (sortBy: string) => {
    setSort((prev) => ({ ...prev, sortBy }));
  };

  const handleDirectionChange = (direction: "asc" | "desc") => {
    setSort((prev) => ({ ...prev, direction }));
  };

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this task?",
    );
    if (!confirm) return;

    try {
      if (workingTask === null) return;
      const status = workingTask.status as TaskStatus;

      const response = await fetch(`/api/tasks/${workingTask.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete task");
      }

      const updatedColumnTasks = data.columns[status].tasks.filter(
        (t) => t.id !== workingTask.id,
      );
      setWorkingTask(null);
      setData({
        ...data,
        columns: {
          ...data.columns,
          [status]: { name: status, tasks: updatedColumnTasks },
        },
      });

      alert("Task deleted successfully!");
    } catch (err) {
      console.log(err);
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div>
      <div className="mx-auto flex max-w-[1000px] flex-wrap justify-end gap-3 md:justify-between">
        <Filters
          onChangeUserId={handleUserIdChange}
          onChangeStatus={handleStatusChange}
          onChangePriority={handlePriorityChange}
        />
        <Sort
          onChangeSort={handleSortChange}
          onChangeDirection={handleDirectionChange}
        />
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex justify-center gap-5 py-3">
              {Object.entries(data.columns).map(([columnId, column]) => (
                <TaskColumn
                  key={columnId}
                  columnId={columnId}
                  column={column}
                  onClickTask={(task) => {
                    setWorkingTask(task);
                    setOpenModal(true);
                  }}
                />
              ))}
            </div>
          </DragDropContext>
        </div>
      </div>
      {workingTask && openModal && (
        <TaskModal
          task={workingTask}
          openModal={openModal}
          setOpenModal={setOpenModal}
          updateTaskField={updateTaskField}
          deleteTask={handleDelete}
        />
      )}
    </div>
  );
};

export default TaskBoard;
