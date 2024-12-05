
import { Task } from "@/types/tasks-types";
import Card from "./cards";
interface props {
    title: string
    tasks: Task[]
}
export default function Column({ title, tasks }: props) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 shadow">
            <h2 className="text-lg font-semibold capitalize mb-4">{title}</h2>
            <div className="space-y-4">
                {tasks?.map((task) => (
                    <Card
                        key={task.id}
                        task={task}

                    />
                ))}
            </div>
        </div>
    );
}