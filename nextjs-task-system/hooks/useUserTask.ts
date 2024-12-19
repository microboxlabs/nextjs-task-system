import { Task } from '@/types/task';
import { useState, useEffect } from 'react';
import { PriorityType } from '@/types/task';
import { socket } from '@/utils/socket';
import { updateTask } from '@/utils/socketUtils';

interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    handleUpdateTask: (taskData: any) => Promise<void>;
    //handleDeleteTask: (taskId: number) => Promise<void>;
    handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function useUserTask(): UseTasksReturn {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/user`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching user tasks:', error);
            alert("An unexpected error occurred while trying to get the tasks.");
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateTask = async (taskData: Task) => {
        try {
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                const { taskUpdated } = await response.json();
                setTasks((prev) =>
                    prev.map((task) => (task.id === taskUpdated.id ? taskUpdated : task))
                );
                socket.emit("updatedTask", taskUpdated);
                alert("Task updated successfully");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse);
                alert("Failed to update Task");
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert("An unexpected error occurred while trying to update the task.");
        }
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const sortBy = e.target.value;
        let sortedTasks = [...tasks];

        const priorityOrder: Record<PriorityType, number> = {
            Low: 1,
            Medium: 2,
            High: 3,
        };

        if (sortBy === 'dueDate') {
            sortedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        } else if (sortBy === 'priority') {
            //const priorityOrder = { Low: 1, Medium: 2, High: 3 };
            sortedTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        } else if (sortBy === 'creationDate') {
            sortedTasks.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime());
        }

        setTasks(sortedTasks);
    };

    useEffect(() => {
        fetchTasks();

        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on("upgrade", (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport("N/A");
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("createTask", fetchTasks);
        socket.on("updatedTask", (updatedTask) => updateTask(updatedTask, setTasks))

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("createTask", fetchTasks);
            socket.off("updatedTask", (updatedTask) => updateTask(updatedTask, setTasks));
        };
    }, []);

    return { tasks, loading, error, handleUpdateTask, handleSortChange }
}