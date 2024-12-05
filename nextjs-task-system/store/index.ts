import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface LoadingStore {
  loading: boolean;
  setLoading: (value: boolean) => void;
}

export const loadingStore = create<LoadingStore>()(
  persist(
    (set) => ({
      loading: false,
      setLoading: (value: boolean) =>
        set(() => ({
          loading: value,
        })),
    }),
    { name: "loading" }
  )
);

interface AuthData {
  token: string;
  id: string;
  username: string;
  role: string;
}

interface AuthStore extends AuthData {
  setToken: (data: AuthData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: "",
      id: "",
      username: "",
      role: "",
      setToken: (data: AuthData) =>
        set(() => ({
          token: data.token,
          id: data.id,
          username: data.username,
          role: data.role,
        })),
      logout: () =>
        set(() => ({
          token: "",
          id: "",
          username: "",
          role: "",
        })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

type Language = "es" | "en";

interface Translation {
  [key: string]: string;
}

const translation: Record<Language, Translation> = {
  es: {
    tableTask: "Tarea de tabla",
    title: "Título",
    description: "Descripción",
    priority: "Prioridad",
    status: "Estado",
    assignedTo: "Asignado a",
    dueDate: "Fecha de vencimiento",
    actions: "acciones",
    newTask: "Nueva tarea",
    updateAt: "Actualizar a las",
    update: "Actualizar",
    username: "Nombre de usuario",
    password: "Contraseña",
    rol: "Rol",
    logout: "Cerrar sesión",
    login: "Iniciar sesión",
    register: "Registrarse",
    tableUser: "Usuario de tabla",
    noRecordFound: "No se encontró ningún registro",
    continue: "Continuar",
    welcomeBacktoTask: "¡Bienvenido de nuevo a Quickbet Movies!",
    taskDescripction: "tarea",
    numberTasks: "Número de tareas",
    tasks: "Tareas",
    users: "Usuarios",
    inTotal: "En total",
    comments: "Comentarios",
    addComment: "Agregar comentario",
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    pending: "Pendiente",
    inProgress: "En progreso",
    completed: "Completado",
    sureToDeleteThisItem: "Asegúrese de eliminar este elemento",
    deleteSuccessfully: "Eliminado correctamente",
    messageCreated: "Mensaje creado",
    back: "Atrás",
    next: "Siguiente",
    previous: "Anterior",
    reset: "Restablecer",
    search: "Buscar",
    anErrorHasOccurred: "Se ha producido un error",
    invalidUsernamePassword: "Nombre de usuario o contraseña no válidos",
    taskUpdatedCreated: "Tarea actualizada creada",
    userCreatedYouCanNowLogIn: "Usuario creado, ahora puede iniciar sesión",
    oldestCreated: "Creación más antigua",
    mostRecentCreated: "Creación más reciente",
    oldestExpirationDate: "Fecha de vencimiento más antigua",
    mostRecentExpirationDate: "Fecha de vencimiento más reciente",
    byPriority: "Por prioridad",
    sorbBy: "Ordenar por",
    titleTaskCommentAdded: "Título del comentario de la tarea añadido: ",
    titleTaskCreatedUpdated: "Título de la tarea creada o actualizada: "
  },
  en: {
    tableTask: "Table task",
    title: "Title",
    description: "Description",
    priority: "Priority",
    status: "Status",
    assignedTo: "Assigned to",
    dueDate: "Due date",
    actions: "actions",
    newTask: "New task",
    updatedAt: "Update at",
    update: "Update",
    username: "Username",
    password: "Password",
    role: "Role",
    logout: "Logout",
    login: "Login",
    register: "Register",
    tableUser: "Table user",
    noRecordFound: "No record found",
    continue: "Continue",
    welcomeBacktoTask: "Welcome back to Quickbet Movies!",
    taskDescripction: "task",
    numberTasks: "Number of tasks",
    tasks: "Tasks",
    users: "Users",
    inTotal: "In total",
    comments: "Comments",
    addComment: "Add comment",
    low: "Low",
    medium: "Medium",
    high: "High",
    pending: "Pending",
    inProgress: "In progress",
    completed: "completed",
    sureToDeleteThisItem: "Sure to delete this item",
    deletedSuccessfully: "Deleted successfully",
    messageCreated: "Message created",
    back: "Back",
    next: "Next",
    previous: "Previous",
    reset: "Reset",
    search: "Search",
    anErrorHasOccurred: "An error has occurred",
    invalidUsernamePassword: "Invalid username or password",
    taskUpdatedCreated: "Task updated created",
    userCreatedYouCanNowLogIn: "User created, you can now log in",
    oldestCreated: "Oldest created",
    mostRecentCreated: "Most recent created",
    oldestExpirationDate: "Oldest expiration date",
    mostRecentExpirationDate: "Most recent expiration date",
    byPriority: "By priority",
    sorbBy: "Sorb by",
    titleTaskCommentAdded: "Title task comment added: ",
    titleTaskCreatedUpdated: "Title task created or updated: "
  },
};

interface ThemeStore {
  isDarkMode: boolean;
  t: Translation;
  toggleDarkMode: (value: boolean) => void;
  setLanguage: (value: Language) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      isDarkMode: false,
      t: translation["es"],
      toggleDarkMode: (value: boolean) =>
        set(() => ({
          isDarkMode: value,
        })),
      setLanguage: (value: Language) =>
        set(() => ({
          t: translation[value],
        })),
    }),
    { name: "theme" }
  )
);
