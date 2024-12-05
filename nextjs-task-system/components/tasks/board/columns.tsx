
import { ResponseTaskGet, Task } from "@/types/tasks-types";
import Card from "./cards";
import { TaskProvider } from "@/context/TaskContext";
interface props {
    title: string
    tasks: Task[]
    setTasksData: React.Dispatch<React.SetStateAction<ResponseTaskGet>>;
    setShowToast: React.Dispatch<React.SetStateAction<{ show: boolean, message: string, icon: 'alert' | 'warning' | 'success' | '' }>>
}
export default function Column({ title, tasks, setShowToast, setTasksData }: props) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold capitalize mb-4">{title}</h2>
            <div className="space-y-4">
                {tasks?.map((task) => (
     
                        <Card
                            setShowToast={setShowToast}
                            setTasksData={setTasksData}
              
                            task={task}

                        />
         
                ))}
            </div>
        </div>
    );
}