"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Select,
  Textarea,
  TextInput,
} from "flowbite-react";
import MultiSelect, { Option } from "@/app/components/MultiSelect";
import { Task } from "@prisma/client";

interface TaskForm extends Pick<Task, "title" | "description" | "priority"> {
  assignedTo: string[];
  dueDate: string;
}

const CreateTask = () => {
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

  return (
    <div className="px-2 py-8">
      <Card className="mx-auto max-w-sm">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create Task
        </h1>
        {error && <Alert color="failure">{error}</Alert>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <TextInput
            type="text"
            placeholder="Title"
            className="input input-bordered w-full"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
          />
          {/* <TextInput
            type="text"
            placeholder="Assigned To"
            className="input input-bordered w-full"
            value={task.assignedTo}
            onChange={(e) => setTask({ ...task, assignedTo: e.target.value })}
          /> */}
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
          <TextInput
            type="datetime-local"
            className="input input-bordered w-full dark:fill-white"
            value={task.dueDate}
            onChange={(e) => setTask({ ...task, dueDate: e.target.value })}
          />
          <Select
            className="select select-bordered w-full pb-4"
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </Select>
          <Button type="submit" className="btn btn-primary w-full">
            Create
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CreateTask;
