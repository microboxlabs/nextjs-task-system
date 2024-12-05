

import React, { useState } from 'react';
import Column from './columns';
import { Task } from '@/types/tasks-types';

interface props{
  tasks : Task[]
}

function BoardViewTasks({tasks}:props) {

  //FIlter the task to put the cards in order
  const columns = {
    "Pending": tasks?.filter((task) => task.status.toLocaleLowerCase() === "pending" ),
    "In Progress": tasks?.filter((task) => task.status.toLocaleLowerCase() === 'in progress'),
    "Completed": tasks?.filter((task) => task.status.toLocaleLowerCase() === "completed"),
  };

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {Object.entries(columns).map(([status, columnTasks]) => (
        <Column
          key={status}
          title={status}
          tasks={columnTasks}

        />
      ))}
    </div>
  );
}






export default BoardViewTasks;
