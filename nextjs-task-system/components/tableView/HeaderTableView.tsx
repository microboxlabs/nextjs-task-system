"use client"
import React, { useState } from 'react'
import { AddTasks } from '../AddTasks'
import TaskFilters from '../TaskFilters'
import { useTasks } from '@/context/TasksContext'
import { usePathname } from 'next/navigation'

const HeaderTableView = () => {
  const pathname = usePathname();
  const isInBoard = pathname === '/board';

  const { tasks, setFilteredTasks, setFilters, isAdmin } = useTasks();

  // Function to handle changes in filters (like status, priority, due date)
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);

    // Filter the tasks based on the new filter values
    const filtered = tasks.filter((task) => {
      return (
        (newFilters.status === '' || task.status === newFilters.status) &&
        (newFilters.priority === '' || task.priority === newFilters.priority) &&
        (newFilters.dueDate === '' || new Date(task.dueDate).toISOString().slice(0, 10) === newFilters.dueDate)
      );
    });

    // Update the filtered tasks in the context with the new filtered tasks
    setFilteredTasks(filtered);
  };

  return (
    <div className={`${isInBoard ? "justify-end " : "justify-between"} flex  w-full px-6 pt-6 items-center`}>
      {!isInBoard && <TaskFilters onFiltersChange={handleFiltersChange} />}

      {isAdmin && <AddTasks />}
    </div>
  )
}

export default HeaderTableView