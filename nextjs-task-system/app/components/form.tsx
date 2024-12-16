
"use client";

import { Button, Label, Select, Textarea, TextInput } from "flowbite-react";
import { useForm } from "../hooks/useForm";


export function Form({ initialData, onSubmit }: { initialData?: any; onSubmit: (data: any) => void }) {
    const { formState, onChangeInput } = useForm(initialData || {});

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formState);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-100 mt-3">
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="title" value="Title" />
                </div>
                <TextInput
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Task title"
                    required
                    shadow
                    value={formState.title || ""}
                    onChange={onChangeInput}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="description" value="Description" />
                </div>
                <Textarea
                    id="description"
                    name="description"
                    placeholder="Task description..."
                    rows={4}
                    value={formState.description || ""}
                    onChange={onChangeInput}
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="assigned_to" value="Assigned" />
                </div>
                <Select
                    id="assigned_to"
                    name="assigned_to"
                    value={formState.assigned_to || ""}
                    onChange={onChangeInput}
                >
                    <option value="">Select user or group</option>
                    <option value="0">Unassigend</option>
                    <option>Canada</option>
                    <option>France</option>
                    <option>Germany</option>
                </Select>
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="due_date" value="Due Date" />
                </div>
                <input
                    id="due_date"
                    name="due_date"
                    type="date" 
                    required
                    value={formState.due_date || ""} 
                    onChange={onChangeInput} 
                     className="block w-full px-3 py-2 text-gray-700 border-1 border-inherit rounded-lg "
                />
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="priority" value="Priority" />
                </div>
                <Select
                    id="priority"
                    name="priority"
                    required
                    value={formState.priority || ""}
                    onChange={onChangeInput}
                >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </Select>
            </div>
            <Button type="submit">Submit</Button>
        </form>
    );
}
