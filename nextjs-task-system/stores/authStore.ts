// stores/authStore.ts
import { User } from "@/types";
import { create } from "zustand";
import { persist, StorageValue } from "zustand/middleware";
import {
  getCookieValue,
  setCookieValue,
  removeCookieValue,
} from "@/utils/cookies";

interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (user) => {
        set({ user });
        setCookieValue("auth-user", user);
      },
      logout: () => {
        set({ user: null });
        removeCookieValue("auth-user");
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name: string): StorageValue<AuthState> | null => {
          return getCookieValue<StorageValue<AuthState>>(name);
        },
        setItem: (name: string, value: StorageValue<AuthState>): void => {
          setCookieValue(name, value);
        },
        removeItem: (name: string): void => {
          removeCookieValue(name);
        },
      },
    },
  ),
);
