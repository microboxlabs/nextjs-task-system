"use client"

import React, { useEffect, useState } from "react";
import { TableComponent } from "@/app/components/Table";
import { TaskModal } from "@/app/components/TaskModal";
import ToastNotification from "@/app/components/ToastNotification";
import { getTasks, deleteTask } from "../../../services/taskService";
import { getComments } from "@/services/commentService";
import { getUser } from "@/services/userService";
import { getGroup } from "@/services/groupService";
import { Button } from "flowbite-react";
import Swal from 'sweetalert2'
import { useAuthRedirect } from "../../utils/useAuthRedirect";

interface Comment {
    id: number;
    content: string;
    createdById: string;
    taskId: number;
}

interface Task {
    id: number;
    title: string;
    description: string;
    assignedToId: number;
    groupId: number;
    dueDate: string;
    priority: string;
    status: string;
    comments?: Comment[];
}

export default function TaskPage() {

    useAuthRedirect();

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastProps, setToastProps] = useState({
        message: "",
        type: "success" as "success" | "error",
    });

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await getTasks();
                const tasksWithComments = await Promise.all(
                    tasks.map(async (task: Task) => {
                        const comments = await getComments(task.id);
                        const assignedTo = task.assignedToId ? await getUser(task.assignedToId) : '';
                        const group = task.groupId ? await getGroup(task.groupId) : '';
                        const transformedTask = {
                            ...task,
                            comments: comments ? comments.map((comment: { content: any; }) => comment.content).join(', ') : '',
                            assignedTo: assignedTo ? assignedTo.name : 'Unknown User',
                            group: group ? group.name : 'Unknown Group'

                        };
                        return transformedTask;
                    })
                );
                setTasks(tasksWithComments);
            } catch (error) {
                console.error("Error fetching tasks: ", error);
            }

        };
        fetchTasks();
    }, []);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleEdit = (task: any) => {
        const { comments, assignedTo, group, ...taskData } = task;
        setFormData(taskData);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        })

        if (result.isConfirmed) {
            try {
                await deleteTask(id);
                setToastProps({ message: "Task deleted successfully", type: "success" });
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
                window.location.reload();
            } catch (error) {
                setToastProps({ message: "Error deleting task", type: "error" });
                setShowToast(true);
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);

            }
        }
    }

    return (
        <div className="container mx-auto">
            <div className="my-4 flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Tasks</h1>
                <Button color="success" onClick={handleOpenModal}>Add Task</Button>
            </div>
            <TableComponent
                data={tasks}
                excludeColumns={['id', 'assignedToId', 'groupId']}
                pageSize={5}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
            />

            {showToast && <ToastNotification message={toastProps.message} type={toastProps.type} />}

        </div>
    );
}

