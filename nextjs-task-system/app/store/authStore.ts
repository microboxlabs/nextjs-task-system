import { create } from "zustand";
import { localStorageHelper } from "../../utils/localStorageHelper";
import { isTokenExpired } from "../../utils/tokenHelper";

type UserRole = "ADMIN" | "REGULAR";

interface User {
  id: number;
  email: string;
  role: UserRole;
  groupId?: number; 
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  token: string;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean; 
  initializeAuth: () => void; 
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: { id: 0, email: "", role: "REGULAR", groupId: 0 }, 
  token: "",

  initializeAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorageHelper.getItem<User>("user");
      const storedToken = localStorageHelper.getItem<string>("token");

      if (storedToken && isTokenExpired(storedToken)) {
        console.warn("Token expired. Logging out...");
        get().logout();
        return;
      }

      if (storedUser) set({ user: storedUser });
      if (storedToken) set({ token: storedToken });
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  },

 
  setUser: (user) => {
    const validUser = { ...user, groupId: user.groupId || 0 }; 
    localStorageHelper.setItem("user", validUser);
    set({ user: validUser });
  },

  
  setToken: (token) => {
    localStorageHelper.setItem("token", token || "");
    set({ token: token || "" });
  },

  
  logout: () => {
    localStorageHelper.removeItem("user");
    localStorageHelper.removeItem("token");

    
    set({
      user: { id: 0, email: "", role: "REGULAR", groupId: 0 },
      token: "",
    });

    
    console.log("User logged out. State reset.");
  },

  hasRole: (roles) => {
    const userRole = get().user.role;
    if (!userRole) return false;

    
    return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
  },
}));


if (typeof window !== "undefined") {
  useAuthStore.getState().initializeAuth();

  
  window.addEventListener("storage", () => {
    useAuthStore.getState().initializeAuth();
  });
}
