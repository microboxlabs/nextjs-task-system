import { Task } from '@/types/task';
import { useState, useEffect } from 'react';
import { PriorityType } from '@/types/task';
import { socket } from '@/utils/socket';
import { onConnect, onDisconnect, updateTask } from '@/utils/socketUtils';

interface UseTasksReturn {
    tasks: Task[];
    loading: boolean;
    error: string | null;
    handleCreateTask: (taskData: any) => Promise<void>;
    handleDeleteTask: (taskId: number) => Promise<void>;
    handleSortChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleUpdateTask: (taskData: Task) => Promise<void>;
}

export function useTask(): UseTasksReturn {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState<boolean>(true); // Estado de carga
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState("N/A");

    const fetchTasks = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/task');
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false)
        }
    }

    const handleCreateTask = async (taskData: Task) => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/task", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                socket.emit("createTask");
                alert("Task created successfully");
            } else {
                const errorResponse = await response.json();
                console.error(errorResponse);
                alert("Failed to create task");
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            alert("An unexpected error occurred while trying to create the task.");
        } finally {
            setLoading(false)
        }
    };

    const handleUpdateTask = async (taskData: Task) => {
        try {
            const response = await fetch('/api/admin/task', {
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


    const handleDeleteTask = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/admin/task?id=${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                alert('Task deleted successfully');
                setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
            } else {
                alert('Failed to delete task');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert("An unexpected error occurred while trying to delete the task.");
        } finally {
            setLoading(false);
        }
    };

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
            onConnect(setIsConnected, setTransport);
        }


        socket.on("connect", () => onConnect(setIsConnected, setTransport));
        socket.on("disconnect", () => onDisconnect(setIsConnected, setTransport));

        socket.on("createTask", fetchTasks);
        socket.on("updatedTask", (updatedTask) => updateTask(updatedTask, setTasks))

        return () => {
            socket.off("connect", () => onConnect);
            socket.off("disconnect", () => onDisconnect);
            socket.off("createTask", fetchTasks);
            socket.off("updatedTask", fetchTasks);
        };
    }, []);

    return { tasks, loading, error, handleCreateTask, handleDeleteTask, handleSortChange, handleUpdateTask }
}