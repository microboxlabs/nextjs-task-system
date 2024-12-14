import { User } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define type of login parameters with UserCredentials
interface AuthState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, // Initial state: no user is logged in
      login: (user) => set({ user: user }), // Correctly set the user
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage", // Name of the storage item
    },
  ),
);
