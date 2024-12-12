
"use client";

import { Button, Checkbox, Label, Select, Textarea, TextInput } from "flowbite-react";
import Link from "next/link";

export function Form() {
    return (
        <form className="flex flex-col gap-4 w-100 mt-3">
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="title" value="Title" />
                </div>
                <TextInput id="title" type="email" placeholder="name@flowbite.com" required shadow />
            </div>
            <div >
                <div className="mb-2 block">
                    <Label htmlFor="Description" value="Description" />
                </div>
                <Textarea id="Description" placeholder="Leave a comment..." required rows={4} />
            </div>

            <div >
                <div className="mb-2 block">
                    <Label htmlFor="countries" value="Assigne To" />
                </div>
                <Select id="countries" required>
                    <option>United States</option>
                    <option>Canada</option>
                    <option>France</option>
                    <option>Germany</option>
                </Select>
            </div>
            <div>
                <div className="mb-2 block">
                    <Label htmlFor="date" value="Due Date" />
                </div>
                <TextInput id="due-date" type="date" required shadow />
            </div>

            <div >
                <div className="mb-2 block">
                    <Label htmlFor="countries" value="Priority" />
                </div>
                <Select id="countries" required>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </Select>
            </div>
            <Button type="submit">Create new task</Button>
        </form>
    );
}
