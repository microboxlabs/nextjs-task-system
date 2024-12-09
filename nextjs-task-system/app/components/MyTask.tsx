"use client";

import { useState, useEffect } from "react";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import Cookies from 'js-cookie';
import { getTasksByGroupIdandAssignedToId, updateTask } from "@/services/taskService";
import { getComments } from "@/services/commentService";
import { CommentModal } from "@/app/components/CommentModal";

interface CustomJwtPayload extends JwtPayload {
    id: string;
    groupId: string;
    role: string;
}

export function MyTask() {

    const [task, setTasks] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const token = Cookies.get("token");
        if (token) {
            const decoded = jwtDecode<CustomJwtPayload>(token);
            const fetchTasks = async () => {
                try {
                    const tasks = await getTasksByGroupIdandAssignedToId(decoded.groupId, decoded.id);
                    const tasksWithComments = await Promise.all(
                        tasks.map(async (task: { id: any; }) => {
                            const comments = await getComments(task.id);
                            return { ...task, comments };
                        })
                    );
                    setTasks(tasksWithComments);

                } catch (error) {
                    console.error("Error fetching tasks: ", error);
                }
            };
            fetchTasks();
        }
    }, []);

    const handleDragStart = (e: any, taskId: string) => {
        e.dataTransfer.setData("taskId", taskId);
    };

    const handleDrop = (e: any, newStatus: string) => {
        const taskId = e.dataTransfer.getData("taskId");
        if (taskId) {
            updateTask(taskId, { status: newStatus }).then(() => {
                const updatedTasks = task.map((task) =>
                    task.id === taskId ? { ...task, status: newStatus } : task
                );
                setTasks(updatedTasks);
                window.location.reload();
            });
        } else {
            console.error("TaskId not found");
        }
    };

    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const handleOpenModal = (taskId: string, createdById: string) => {
        setFormData({ taskId, createdById });
        setIsModalOpen(true);
    };


    return (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {["Pending", "In Progress", "Completed"].map((status) => (
                <div
                    key={status}
                    className="rounded-lg bg-gray-100 p-4 shadow "
                >
                    <h3 className="mb-2 text-center text-lg font-bold">{status}</h3>
                    <div
                        id={status}
                        className="min-h-[300px] rounded-lg bg-white p-2 shadow-inner"
                        onDrop={(e) => handleDrop(e, status)}
                        onDragOver={handleDragOver}
                    >
                        {task
                            .filter((task) => task.status === status)
                            .map((task) => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, task.id)}
                                    className="mb-2 cursor-move rounded-md bg-blue-500 p-2 text-white shadow"
                                >
                                    <div>{task.title}</div>
                                    <div className="text-sm text-gray-200">{task.description}</div>
                                    <div className="text-sm text-gray-200">Due Date: {task.dueDate}</div>
                                    <div className="text-sm text-gray-200">Priority: {task.priority}</div>


                                    <div className="mt-2">
                                        <h4 className="text-sm font-bold">Comments:</h4>
                                        {task.comments && task.comments.length > 0 ? (
                                            <ul className="text-xs text-gray-300">
                                                {task.comments.map((comment: any, index: number) => (
                                                    <li key={index} className="mb-1">
                                                        {comment.content} - <span className="italic"></span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-xs italic text-gray-300">No comments yet.</p>
                                        )}
                                    </div>
                                    <button className="mt-2 rounded-md bg-lime-500 px-2 py-1 text-sm hover:bg-gray-300"
                                        onClick={() => handleOpenModal(task.id, task.assignedToId)}
                                    >
                                        add a comment
                                    </button>
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            <CommentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
            />
        </div>
    );
}

