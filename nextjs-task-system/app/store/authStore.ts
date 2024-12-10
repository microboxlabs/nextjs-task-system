import { create } from "zustand";

type UserRole = "ADMIN" | "REGULAR";

interface User {
  id: number;
  email: string;
  role: UserRole;
  groupId?: number;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  initializeAuth: () => Promise<void>; // Cambiamos a async
}

export const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  user: null, // Usuario inicial nulo

  // Inicializar autenticación
  initializeAuth: async () => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include", // Incluir cookies en la solicitud
      });

      if (!response.ok) {
        set({ isAuthenticated: false, user: null });
        return;
      }

      const user = await response.json();
      set({ isAuthenticated: true, user });
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ isAuthenticated: false, user: null });
    }
  },

  // Establecer el usuario después de login exitoso
  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  // Cerrar sesión
  logout: async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Incluir cookies para limpiar en el backend
      });

      set({ isAuthenticated: false, user: null });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  },

  // Verificar roles
  hasRole: (roles) => {
    const userRole = get().user?.role;
    if (!userRole) return false;

    return Array.isArray(roles) ? roles.includes(userRole) : userRole === roles;
  },
}));

// Ejecutar initializeAuth en el cliente
if (typeof window !== "undefined") {
  useAuthStore.getState().initializeAuth();

  // Sincronizar estado entre pestañas
  window.addEventListener("storage", () => {
    useAuthStore.getState().initializeAuth();
  });
}
