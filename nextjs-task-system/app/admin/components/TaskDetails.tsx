"use client";
import { Button, Drawer, Label, Select, Textarea, TextInput, Datepicker } from "flowbite-react";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";
import { PriorityType } from "@/types/task";
import { GroupProvider } from "@/contexts/GroupContext";
import SelectUserGroup from "./SelectUserGroup";
import { getMinDate } from "@/utils/helpers";
import { useTask } from "@/hooks/useTask";

interface CompleteTaskProps {
    isOpen: boolean; // Indica si el Drawer está abierto o cerrado
    handleClose: () => void; // Función para cerrar el Drawer
    task: Task | null; // Tarea seleccionada
}

export default function TaskDetails({ isOpen, handleClose, task }: CompleteTaskProps) {
    const { handleUpdateTask } = useTask();
    const [formData, setFormData] = useState<Task>({
        id: 0,
        title: task?.title || "",
        description: "",
        assignedTo: "",
        idAssignedTo: "",
        comments: "",
        dueDate: new Date().toISOString(),
        priority: "Low" as PriorityType,
        status: "Pending",
        creationDate: ""
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleOnChangeAss = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== "") {
            const parsedValue = JSON.parse(e.target.value)
            setFormData((prev) => ({
                ...prev,
                assignedTo: parsedValue.nameAss,
                idAssignedTo: parsedValue.idAss
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                assignedTo: ""
            }));
        }
    };

    const handleChangeDate = (date: Date | null) => {
        console.log(date?.toISOString());

        setFormData(prev => ({
            ...prev,
            dueDate: date?.toISOString() || "",
        }));
    };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            //const { idAss, nameAss } = JSON.parse(formData.assignedTo);
            console.log(formData.assignedTo);
            console.log(formData.idAssignedTo);
            
            

            if (formData.title !== "" && formData.assignedTo !== "" && formData.description !== "") {
                await handleUpdateTask({
                    id: formData.id,
                    title: formData.title,
                    description: formData.description,
                    assignedTo: formData.assignedTo,
                    idAssignedTo: formData.idAssignedTo,
                    dueDate: formData.dueDate,
                    priority: formData.priority,
                    status: formData.status,
                    creationDate: formData.creationDate,
                    comments: formData.comments
                })

                setFormData({
                    id: 0,
                    title: task?.title || "",
                    description: "",
                    assignedTo: "",
                    idAssignedTo: "",
                    comments: "",
                    dueDate: new Date().toISOString(),
                    priority: "Low" as PriorityType,
                    status: "Pending",
                    creationDate: ""
                });
            } else {
                alert('All inputs must by filled')
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (task) {
            setFormData(task);
        }
    }, [isOpen]);

    return (
        <Drawer open={isOpen} onClose={handleClose} className="w-[390px]">
            <Drawer.Header title="Task Details" />
            <Drawer.Items>
                <form onSubmit={handleSubmit}>
                    <div className="dark:text-white mb-6 mt-3">
                        <Label htmlFor="title" className="dark:text-white mb-2 block">Title</Label>
                        <TextInput id="title" value={formData?.title || ""} onChange={handleChange} className="dark:text-white italic" />
                    </div>
                    <div className="dark:text-white mb-6 mt-3">
                        <Label htmlFor="description" className="dark:text-white mb-2 block">Description</Label>
                        <Textarea id="description" rows={2} value={formData?.description || ""} onChange={handleChange} className="dark:text-white italic" />
                    </div>

                    <div className="dark:text-white mb-4">
                        <GroupProvider>
                            <SelectUserGroup assValue={{ idAss: formData?.idAssignedTo, nameAss: formData?.assignedTo }} fnOnChange={handleOnChangeAss} />
                        </GroupProvider>
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="dueDate" value="Due Date" />
                        </div>
                        <Datepicker id="dueDate" name="dueDate" weekStart={1} value={new Date(formData.dueDate)} minDate={getMinDate()} onChange={handleChangeDate} required />
                    </div>
                    <div className="dark:text-white mb-6 mt-6">
                        <Label htmlFor="priority" className="dark:text-white mb-2 block">Priority</Label>
                        <Select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                        </Select>
                    </div>
                    <div className="dark:text-white mb-6 mt-3">
                        <Label htmlFor="status" className="dark:text-white mb-2 block">Status</Label>
                        <Select id="status" name="priority" value={formData.status} onChange={handleChange} required>
                            <option>Pending</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </Select>
                    </div>

                    <div className="dark:text-white mb-6">
                        <Label htmlFor="comments" className="dark:text-white mb-2 block">Comments</Label>
                        <Textarea id="comments" rows={4} value={formData?.comments || ""} onChange={handleChange} className="dark:text-white italic" />
                    </div>
                    <Button className="w-full" type="submit">Update</Button>
                </form>
            </Drawer.Items>
        </Drawer>
    )
}