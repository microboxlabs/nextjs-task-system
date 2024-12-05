import { Task } from "@/types/tasks-types";

interface props{
    task: Task
}
export default function Card({ task }: props) {
    return (
        <div className="bg-white dark:bg-gray-700 rounded p-3 shadow">
            <h3 className="font-medium">{task.title}</h3>
            <p className="text-sm text-gray-500">Assigned to: {task.user}</p>
            <p className="text-sm text-gray-500">Due: {task.dueDate.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Priority: {task.priority}</p>
            <div className="flex justify-end space-x-2 mt-2">

            </div>
        </div>
    );
}