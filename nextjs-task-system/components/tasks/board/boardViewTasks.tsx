import React from "react";
import Column from "./columns";
import { ResponseTaskGet, Task } from "@/types/tasks-types";

interface Props {
  tasks: Task[];
  setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
  setShowToast: React.Dispatch<
    React.SetStateAction<{
      show: boolean;
      message: string;
      icon: "alert" | "warning" | "success" | "";
    }>
  >;
}

function BoardViewTasks({ tasks, setTasksData, setShowToast }: Props) {
  const columns = {
    Pending: tasks?.filter((task) => {
      return task.status.name.toLocaleLowerCase() === "pending";
    }),
    "In Progress": tasks?.filter((task) => {
      return task.status.name.toLocaleLowerCase() === "in progress";
    }),
    Completed: tasks?.filter((task) => {
      return task.status.name.toLocaleLowerCase() === "completed";
    }),
  };

  return (
    <div className="w-full overflow-x-auto p-4">
      <div className="flex w-max gap-4">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div className="w-[300px]" key={status}>
            {" "}
            {/* Ancho fijo para cada columna */}
            <Column
              title={status}
              tasks={columnTasks}
              setTasksData={setTasksData}
              setShowToast={setShowToast}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardViewTasks;
