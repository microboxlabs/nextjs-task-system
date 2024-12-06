import { ResponseTaskGet, Task } from "@/types/tasks-types";
import Card from "./cards";
import { TaskProvider } from "@/context/TaskContext";
interface props {
  title: string;
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
export default function Column({
  title,
  tasks,
  setShowToast,
  setTasksData,
}: props) {
  return (
    <div className="rounded-lg bg-gray-100 p-4 shadow dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold capitalize">{title}</h2>
      <div className="space-y-4">
        {tasks?.map((task) => (
          <Card
            key={task.id}
            setShowToast={setShowToast}
            setTasksData={setTasksData}
            task={task}
          />
        ))}
      </div>
    </div>
  );
}
