// stores/usersStore.ts
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User } from "@/types";
import { apiRequest } from "../utils/apiUtils";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  getUsers: () => Promise<void>;
}

const fetchUsers = async (): Promise<User[]> => {
  return apiRequest({ url: "/api/users", method: "GET" });
};

export const useUsersStore = create<UsersState>()(
  devtools((set) => ({
    users: [],
    loading: false,
    error: null,

    getUsers: async () => {
      set({ loading: true, error: null });
      try {
        const users = await fetchUsers();
        set({ users, loading: false });
      } catch (err) {
        set({ error: (err as Error).message, loading: false });
        throw err;
      }
    },
  })),
);
