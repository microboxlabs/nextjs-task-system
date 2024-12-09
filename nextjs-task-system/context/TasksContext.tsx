"use client";

// TasksContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

type Task = {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedTo: { name: string };
};

type TasksContextType = {
  tasks: Task[];
  filteredTasks: Task[];
  setFilteredTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  isAdmin: boolean;
  addTask: (newTask: Task) => void;
  updateTask: (updatedTask: Task) => void;
};

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TasksContext);

  // Ensuring that useTasks is only used within TaskProvider to avoid runtime errors
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ tasks, isAdmin, children }: { tasks: Task[]; isAdmin: boolean; children: React.ReactNode }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    dueDate: '',
    assignedTo: '',
  });
  
  // When `tasks` prop changes, update the filtered tasks state to keep it in sync
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks])

  // Append new task to the filtered tasks list
  const addTask = (newTask: Task) => {
    setFilteredTasks((prevTasks) => [...prevTasks, newTask]);
  };

   // Replace the task in the filtered list if it matches the updated task id
  const updateTask = (updatedTask: Task) => {
    setFilteredTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        filteredTasks,
        setFilteredTasks,
        filters,
        setFilters,
        isAdmin,
        addTask,
        updateTask,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};
