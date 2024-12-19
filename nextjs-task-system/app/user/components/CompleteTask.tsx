"use client";
import { Button, Drawer, Label, Textarea } from "flowbite-react";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";

interface CompleteTaskProps {
    isOpen: boolean; // Indica si el Drawer está abierto o cerrado
    handleClose: () => void; // Función para cerrar el Drawer
    task: Task | null;
    fnUpdateTask: any
}

export default function CompleteTask({ isOpen, handleClose, task, fnUpdateTask }: CompleteTaskProps) {
    const [comments, setComments] = useState<string>("");

    const closeAndReset = () => {
        setComments('')
        handleClose()
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        await fnUpdateTask({
            id: task?.id,
            comments: comments
        })
        closeAndReset()
    }

    useEffect(() => {
        setComments(task?.comments || "")
    }, [isOpen])

    return (
        <Drawer open={isOpen} onClose={closeAndReset}>
            <Drawer.Header title="Task" />
            <Drawer.Items>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6 mt-3">
                        <p className="dark:text-white font-medium mb-2 block text-lg">Description</p>
                        <p className="dark:text-white">{task?.description}</p>
                    </div>
                    <div className="mb-6">
                        <Label htmlFor="completeTaskComments" className="mb-2 block">
                            Comments
                        </Label>
                        <Textarea id="completeTaskComments" name="completeTaskComments" value={comments} onChange={e => setComments(e.target.value)} placeholder="Your comments..." rows={4} />
                    </div>
                    <div className="mb-6 gap-3 flex flex-col">
                        {<p className={`text-white font-medium text-sm ${task?.status === 'Completed' && `hidden`}`}>Set status</p>}
                        {task?.status === 'Pending' &&
                            <Button type="submit" color="blue" className="w-full">In Progress</Button>
                        }
                        {task?.status === 'In Progress' &&
                            <Button type="submit" color="green" className="w-full">Complete</Button>
                        }
                    </div>
                </form>
            </Drawer.Items>
        </Drawer>
    )
}