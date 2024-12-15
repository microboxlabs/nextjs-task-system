"use client";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Label,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import MultiSelect, { Option } from "@/app/components/MultiSelect";
import { Task } from "@prisma/client";
import { useSession } from "next-auth/react";

interface TaskForm extends Pick<Task, "title" | "description" | "priority"> {
  assignedTo: string[];
  dueDate: string;
}

const CreateTask = () => {
  const { data: session } = useSession();
  const [task, setTask] = useState<TaskForm>({
    title: "",
    description: "",
    assignedTo: [],
    dueDate: "",
    priority: "Medium",
  });

  const [users, setUsers] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        router.push("/");
      } else {
        console.error("Unable to create task");
        setError("Unable to create task");
      }
    } catch (error) {
      //@ts-ignore
      setError(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        const userOptions = data.map((user: { id: string; name: string }) => ({
          label: user.name,
          value: user.id,
        }));

        setUsers(userOptions);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  if (!session) redirect("/auth/signin");

  return (
    <main className="p-2">
      <Card className="mx-auto max-w-sm gap-1">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Create Task
        </h1>
        {error && <Alert color="failure">{error}</Alert>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <TextInput
              id="title"
              type="text"
              placeholder="Title"
              className="input input-bordered w-full"
              value={task.title}
              onChange={(e) => setTask({ ...task, title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              className="textarea textarea-bordered w-full"
              value={task.description}
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
            />
          </div>
          <div>
            <Label>Assigned To</Label>
            <MultiSelect
              options={users}
              selected={selectedOptions}
              onChange={(options) => {
                setSelectedOptions(options);
                setTask((task) => ({
                  ...task,
                  assignedTo: options.map((option) => option.value),
                }));
              }}
              placeholder="Assigned To"
            />
          </div>
          <div>
            <Label htmlFor="dueDate">Due Date</Label>
            <TextInput
              id="dueDate"
              type="datetime-local"
              className="input input-bordered w-full dark:fill-white"
              value={task.dueDate}
              onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>

            <Select
              id="priority"
              className="select select-bordered w-full pb-4"
              value={task.priority}
              onChange={(e) => setTask({ ...task, priority: e.target.value })}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </Select>
          </div>
          <Button type="submit" className="btn btn-primary w-full">
            Create
          </Button>
        </form>
      </Card>
    </main>
  );
};

export default CreateTask;
