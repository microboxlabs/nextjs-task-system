"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, Label, TextInput } from "flowbite-react";
import MultiSelect, { Option } from "@/app/components/MultiSelect";

interface GroupForm {
  name: string;
  userIds: number[];
}

export const CreateGroup = () => {
  const [group, setGroup] = useState<GroupForm>({
    name: "",
    userIds: [],
  });

  const [users, setUsers] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const response = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(group),
      });

      if (response.ok) {
        router.push("/tasks/create");
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
    <main className="p-2">
      <Card className="mx-auto max-w-sm gap-1">
        <h1 className="text-lg font-bold text-gray-900 dark:text-white">
          Create Group
        </h1>
        {error && <Alert color="failure">{error}</Alert>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <TextInput
              id="name"
              type="text"
              placeholder="Name"
              className="input input-bordered w-full"
              value={group.name}
              onChange={(e) => setGroup({ ...group, name: e.target.value })}
            />
          </div>

          <div className="pb-4">
            <Label>Group members</Label>
            <MultiSelect
              options={users}
              selected={selectedOptions}
              onChange={(options) => {
                setSelectedOptions(options);
                setGroup((task) => ({
                  ...task,
                  userIds: options.map((option) => parseInt(option.value)),
                }));
              }}
              placeholder="Group members"
            />
          </div>

          <Button type="submit" className="btn btn-primary w-full">
            Create
          </Button>
        </form>
      </Card>
    </main>
  );
};
