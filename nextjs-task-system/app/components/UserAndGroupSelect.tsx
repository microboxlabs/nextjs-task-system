import { Label } from "flowbite-react";
import React, { useEffect, useState } from "react";
import MultiSelect, { Option } from "./MultiSelect";
import { CreateUserOrGroup, UserOrGroup, UserPartial } from "../types";
import { Group } from "@prisma/client";

interface UserAndGroupSelect {
  values: Option[];
  onChange: (userOrGroups: CreateUserOrGroup[]) => void;
}

export function UserAndGroupSelect({ values, onChange }: UserAndGroupSelect) {
  const [usersAndGroups, setUsersAndGroups] = useState<Option[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(values);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsersAndGroups = async () => {
      try {
        setIsLoading(true);
        const [responseUsers, responseGroups] = await Promise.all([
          fetch("/api/users"),
          fetch("/api/groups"),
        ]);
        if (!responseUsers.ok) {
          throw new Error("Failed to fetch users");
        }
        if (!responseGroups.ok) {
          throw new Error("Failed to fetch groups");
        }
        const users: UserPartial[] = await responseUsers.json();
        const groups: Group[] = await responseGroups.json();

        const usersAndGroups = [
          ...(groups.map((group) => ({
            label: group.name,
            value: `group-${group.id}`,
          })) as Option[]),
          ...(users.map((user) => ({
            label: user.name,
            value: `user-${user.id}`,
          })) as Option[]),
        ];

        setUsersAndGroups(usersAndGroups);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsersAndGroups();
  }, []);

  return (
    <div>
      <Label>Assigned To</Label>
      <MultiSelect
        options={usersAndGroups}
        selected={selectedOptions}
        onChange={(options) => {
          setSelectedOptions(options);
          onChange(
            options.map((option) => {
              const [type, id] = option.value.split("-");
              const res = {
                type: type as UserOrGroup,
                [`${type}Id`]: parseInt(id),
              };
              return res;
            }),
          );
        }}
        placeholder="Assigned To"
        isLoading={isLoading}
      />
    </div>
  );
}
