"use client";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { UserT, GroupT, GroupMembershipT } from "@/db/type";
import { redirect } from "next/navigation";
import { useUserContext } from "./UserContext";
import { toast } from "sonner";
import { groupMemberships, UserRoles } from "@/db/schema";
interface UserGroupContext {
  groups: GroupT[] | undefined;
  users: UserT[] | undefined;
  createGroup: (name: string) => Promise<void>;
  manageMembership: (
    userId: string,
    groupId: string,
    add?: boolean,
  ) => Promise<void>;
  changeUserRole: (userId: string, role: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
}
export const UserGroupsContext = createContext<UserGroupContext | undefined>(
  undefined,
);

export const UsersGroupProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useUserContext();
  const [users, setUsers] = useState<UserT[]>();
  const [groups, setGroups] = useState<GroupT[]>();
  const getUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/users");
      if (!response.ok) throw new Error("Unkwown");
      const data = await response.json();
      setUsers(data.users);
    } catch (error) {
      console.error(error);
    }
  }, []);
  const getGroups = useCallback(async () => {
    try {
      const response = await fetch("/api/v1/groups");
      const data = await response.json();
      if (!response.ok) throw new Error("Unkown");
      setGroups(data.groups);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const createGroup = useCallback(async (name: string) => {
    try {
      const response = await fetch("/api/v1/groups", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        toast.error("There has been an error");
        return;
      }
      const data = await response.json();
      setGroups((prev) => (prev ? [data.group, ...prev] : [data.group]));
      toast.success("Group created successfully");
    } catch (error) {
      console.error(error);
      toast.error("There has been an error");
    }
  }, []);

  const deleteGroup = useCallback(async (groupId: string) => {
    try {
      const response = await fetch("/api/v1/groups/" + groupId, {
        method: "DELETE",
      });
      if (!response.ok) {
        toast.error("There was an error deleting the group");
        return;
      }
      setGroups((prev) => prev?.filter((group) => group.id !== groupId));
      toast.success("Group deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("There has been an error");
    }
  }, []);

  // works for adding and removing || Or so I think
  const manageMembership = useCallback(
    async (userId: string, groupId: string, add: boolean = true) => {
      try {
        const response = await fetch(
          `/api/v1/${add ? "groups" : "membership"}/` + groupId,
          {
            body: JSON.stringify({ userId }),
            method: add ? "POST" : "DELETE",
            headers: {
              "Content-type": "application/json",
            },
          },
        );
        if (!response.ok) {
          toast.error("There has been an error");
          return;
        }

        const data = await response.json();
        setUsers((prev) =>
          prev?.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  groupMemberships: add
                    ? user.groupMemberships
                      ? [data.membership, ...user.groupMemberships]
                      : [data.membership]
                    : user.groupMemberships?.filter(
                        (membership) => membership.id !== data.membership.id,
                      ),
                }
              : user,
          ),
        );
      } catch (error) {
        console.error(error);
        toast.error("There has been an error");
      }
    },
    [setUsers],
  );

  //

  const changeUserRole = useCallback(async (userId: string, role: string) => {
    try {
      const response = await fetch("/api/v1/users/" + userId, {
        method: "PUT",
        body: JSON.stringify({ role }),
        headers: {
          "Content-type": "application/json",
        },
      });
      if (!response.ok) {
        toast.error("there has been an error");
        return;
      }
      setUsers((prev) =>
        prev?.map((user) =>
          user.id === userId ? { ...user, role: role as UserRoles } : user,
        ),
      );
      toast.success("User role updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("There has been an error");
    }
  }, []);

  const contextValues = {
    groups,
    users,
    createGroup,
    manageMembership,
    changeUserRole,
    deleteGroup,
  };

  useEffect(() => {
    // avoid running this logic if there's no user to check their role
    if (!user) return;
    if (user.role !== "ADMIN") return;
    getUsers();
    getGroups();
  }, [user]);
  return (
    <UserGroupsContext.Provider value={contextValues}>
      {children}
    </UserGroupsContext.Provider>
  );
};

export const useUserGroupContext = () => {
  const context = useContext(UserGroupsContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
