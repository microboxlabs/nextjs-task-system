"use client";

import { useState, FormEvent } from "react";
import { CombinedOptions, User } from "@/app/lib/definitions";
import { Button, Label, Select, TextInput } from "flowbite-react";

function Form({
  onSubmitSuccess,
  combinedOptions,
}: {
  onSubmitSuccess: () => void;
  combinedOptions: CombinedOptions[];
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const response = await fetch("http://localhost:3000/api/tasks/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the task. Please try again");
      }
      onSubmitSuccess();
    } catch (error: any) {
      setError(error.message);
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
          type="title"
          placeholder="Task"
          name="title"
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
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="group" value="Assigned To" />
        </div>
        <Select id="assignedTo" name="assignedTo" required>
          {combinedOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="dueDate" value="date" />
        </div>
        <TextInput
          id="dueDate"
          name="dueDate"
          type="date"
          placeholder="09-12-2024"
          required
        />
      </div>
      <div>
        <div className="mb-2 block">
          <Label htmlFor="priority" value="Priority" />
        </div>
        <Select id="priority" name="priority" required>
          <option value={"low"}>Low</option>
          <option value={"medium"}>Medium</option>
          <option value={"high"}>High</option>
        </Select>
      </div>
      <Button type="submit" color="success" disabled={isLoading}>
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </form>
  );
}
export default Form;
