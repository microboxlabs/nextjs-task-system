import React from "react";
import Column from "./columns";
import { ResponseTaskGet, Task } from "@/types/tasks-types";
import { useGlobalContext } from "@/context/GlobalContext";
import { User } from "@/types/global-types";

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

export default function BoardViewTasks({
  tasks,
  setTasksData,
  setShowToast,
}: Props) {
  const userLogged: User = useGlobalContext();

  const columns = {
    Pending: tasks?.filter((task) => {
      // Admin sees all tasks
      if (userLogged.rol === 1) {
        return task.status.name.toLocaleLowerCase() === "pending";
      }

      // Non-admins see only their tasks or tasks assigned to their group
      return (
        task.status.name.toLocaleLowerCase() === "pending" &&
        (task.user?.id === userLogged.userId ||
          (userLogged.groupId !== null &&
            task.group?.id === userLogged.groupId))
      );
    }),
    "In Progress": tasks?.filter((task) => {
      // Admin sees all tasks
      if (userLogged.rol === 1) {
        return task.status.name.toLocaleLowerCase() === "in progress";
      }

      // Non-admins see only their tasks or tasks assigned to their group
      return (
        task.status.name.toLocaleLowerCase() === "in progress" &&
        (task.user?.id === userLogged.userId ||
          (userLogged.groupId !== null &&
            task.group?.id === userLogged.groupId))
      );
    }),
    Completed: tasks?.filter((task) => {
      // Admin sees all tasks
      if (userLogged.rol === 1) {
        return task.status.name.toLocaleLowerCase() === "completed";
      }

      // Non-admins see only their tasks or tasks assigned to their group
      return (
        task.status.name.toLocaleLowerCase() === "completed" &&
        (task.user?.id === userLogged.userId ||
          (userLogged.groupId !== null &&
            task.group?.id === userLogged.groupId))
      );
    }),
  };

  return (
    <div className="w-full overflow-x-auto p-4">
      <div className="flex w-max gap-4">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div className="w-[300px]" key={status}>
            {/* Fixed width for each column */}
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
