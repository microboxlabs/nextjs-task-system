import { create } from "zustand";
import { localStorageHelper } from "../../utils/localStorageHelper";
import { isTokenExpired } from "../../utils/tokenHelper";

type UserRole = "ADMIN" | "REGULAR";

interface User {
  id: number;
  email: string;
  role: UserRole;
  groupId?: number; // `groupId` puede ser opcional para usuarios sin grupo
}

interface AuthState {
  isAuthenticated: boolean;
  user: User;
  token: string;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean; // Verifica uno o varios roles
  initializeAuth: () => void; // Inicializa el estado desde localStorage
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: { id: 0, email: "", role: "REGULAR", groupId: 0 }, // Valores iniciales válidos
  token: "",

  // Inicializar el estado desde localStorage
  initializeAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const storedUser = localStorageHelper.getItem<User>("user");
      const storedToken = localStorageHelper.getItem<string>("token");

      // Verificar si el token está expirado
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

  // Establecer el usuario
  setUser: (user) => {
    const validUser = { ...user, groupId: user.groupId || 0 }; // Garantizar que `groupId` sea válido
    localStorageHelper.setItem("user", validUser);
    set({ user: validUser });
  },

  // Establecer el token
  setToken: (token) => {
    localStorageHelper.setItem("token", token || "");
    set({ token: token || "" });
  },

  // Cerrar sesión
  logout: () => {
    localStorageHelper.removeItem("user");
    localStorageHelper.removeItem("token");

    // Resetear el estado global
    set({
      user: { id: 0, email: "", role: "REGULAR", groupId: 0 },
      token: "",
    });

    // Notificar a los componentes dependientes
    console.log("User logged out. State reset.");
  },

  // Verificar roles
  hasRole: (roles) => {
    const userRole = get().user.role;
    if (!userRole) return false;

    // Soporte para uno o varios roles
    return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
  },
}));

// Inicialización automática
if (typeof window !== "undefined") {
  useAuthStore.getState().initializeAuth();

  // Sincronización entre pestañas
  window.addEventListener("storage", () => {
    useAuthStore.getState().initializeAuth();
  });
}
