"use client";

import { useState, useEffect, FormEvent } from "react";
import { CombinedOptions, Task } from "@/app/lib/definitions";
import { Button, Label, Select, TextInput } from "flowbite-react";
import { createTask, updateTask } from "@/app/lib/fetchParams";
import { useSearchParams } from "next/navigation";
import { tasks } from "@/app/lib/data";

function Form({
  onSubmitSuccess,
  combinedOptions,
}: {
  onSubmitSuccess: () => void;
  combinedOptions: CombinedOptions[];
}) {
  const searchParams = useSearchParams();
  const taskId = searchParams.get("id");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [taskData, setTaskData] = useState<Task | null>(null);

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const task = tasks.find((task) => task.id === +taskId);
          setTaskData(task);
        } catch (error) {
          setError("Error fetching task");
        }
      };
      fetchTask();
    }
  }, [taskId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      if (taskId) {
        await updateTask(taskId, data);
      } else {
        await createTask(data);
      }
      onSubmitSuccess();
    } catch (error) {
      setError("Error submitting task");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="title" value="Title" />
        </div>
        <TextInput
          id="title"
          type="text"
          placeholder="Task"
          name="title"
          defaultValue={taskData?.title}
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="description" value="Description" />
        </div>
        <TextInput
          id="description"
          name="description"
          type="text"
          sizing="lg"
          placeholder="Any description..."
          defaultValue={taskData?.description}
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="group" value="Assigned To" />
        </div>
        <Select
          id="assignedTo"
          name="assignedTo"
          defaultValue={taskData?.assignedTo?.id}
          required
        >
          <option>{taskData?.assignedTo?.name}</option>
          {combinedOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="dueDate" value="Date" />
        </div>
        <TextInput
          id="dueDate"
          name="dueDate"
          type="date"
          placeholder="09-12-2024"
          defaultValue={taskData?.dueDate?.split("T")[0]}
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="priority" value="Priority" />
        </div>
        <Select
          id="priority"
          name="priority"
          defaultValue={taskData?.priority}
          required
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>
      </div>
      <Button type="submit" color="success" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}

export default Form;
