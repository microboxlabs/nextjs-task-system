"use client";
import Link from "next/link";
import { Button, Label, TextInput, Select, Card, Datepicker } from "flowbite-react";
import { ForwardedMyButton } from "@/components/ButtonLink";
import { GroupProvider } from "@/contexts/GroupContext";
import SelectUserGroup from "../components/SelectUserGroup";
import { useTask } from "@/hooks/useTask";
import { useState } from "react";
import { PriorityType } from "@/types/task";
import { getMinDate } from "@/utils/helpers";

export default function CreateTask() {
    const { handleCreateTask } = useTask();
    const [formData, setFormData] = useState<CreateTaskForm>({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: new Date(),
        priority: "Low" as PriorityType,
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { id, value } = e.target;
        
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleOnChangeAss = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(e.target.value !== ""){
            const parsedValue = JSON.parse(e.target.value)
            setFormData((prev) => ({
                ...prev,
                assignedTo: parsedValue
            }));
        }else{
            setFormData((prev) => ({
                ...prev,
                assignedTo: ""
            }));
        }
    };

    const handleChangeDate = (date: Date | null) => {
        setFormData(prev => ({
          ...prev,
          dueDate: date,
        }));
      };

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            const { idAss, nameAss } = formData.assignedTo;

            if(formData.title !== "" && formData.assignedTo !== "" && formData.description !== ""){
                await handleCreateTask({
                    title: formData.title,
                    description: formData.description,
                    assignedTo: nameAss,
                    dueDate: formData.dueDate,
                    priority: formData.priority,
                    idAssignedTo: idAss,
                })

                setFormData({
                    title: "",
                    description: "",
                    assignedTo: "",
                    dueDate: new Date(),
                    priority: "Low",
                });
            } else {
                alert('All inputs must by filled')
            }      
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <h1 className="text-2xl font-bold dark:text-white text-center pt-6">Create Task</h1>
            <div className="flex flex-col items-center m-3 gap-3 mb-9">
                <div className="my-3 w-full max-w-2xl flex justify-end">
                    <Link href={'/admin/dashboard'}>
                        <ForwardedMyButton label="Back" />
                    </Link>
                </div>
                <Card className="w-full max-w-2xl">
                    <h2 className="text-xl font-semibold dark:text-white text-start">New Task</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="title" value="Title" />
                            </div>
                            <TextInput id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" minLength={6} required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="description" value="Description" />
                            </div>
                            <TextInput id="description" name="description" value={formData.description} onChange={handleChange} minLength={6} placeholder="Task Description" required/>
                        </div>
                        <div>
                            <GroupProvider>
                                <SelectUserGroup assValue={formData.assignedTo} fnOnChange={handleOnChangeAss} />
                            </GroupProvider>
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="dueDate" value="Due Date" />
                            </div>
                            <Datepicker id="dueDate" name="dueDate" weekStart={1} value={formData.dueDate} onChange={handleChangeDate} minDate={getMinDate()} required />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="priority" value="Priority" />
                            </div>
                            <Select id="priority" name="priority" value={formData.priority} onChange={handleChange} required>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </Select>
                        </div>
                        <Button className="mt-3" type="submit">Submit</Button>
                    </form>
                </Card>
            </div>
        </>
    );
}