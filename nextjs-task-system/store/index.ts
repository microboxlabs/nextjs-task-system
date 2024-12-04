import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const loadingStore = create(
  persist(
    (set) => ({
      loading: false,
      setLoading: (value:boolean) =>
        set(() => ({
          loading: value,
        })),
    }),
    { name: "loading" }
  )
);

export const useAuthStore = create(
  persist(
    (set) => ({
      token: "",
      id: "",
      username: "",
      role: "",
      setToken: (data:any) =>
        set(() => ({
          token: data.token,
          id: data.id,
          username: data.username,
          role: data.role,
        })),
      logout: () => {
        set(() => ({
          token: "",
          id: "",
          username: "",
          role: "",
        }));
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

const traslation:any = { 
  es:{
    tableTask: "Lista de tareas"
  },
  en: {
    tableTask: "Table task",
    title: "Title",	
    description	:"Description",	
    priority	:"Priority",	
    status	:"Status",	
    assignedTo	:"Assigned to",	
    dueDate	:"Due date",	
    actions:"actions",
    newTask: "New task",
    updatedAt: "Update at",
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
    tasks:"Tasks",
    users:"Users",
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
    sorbBy: "Sorb by"
  }
}

export const useTheme = create(
  persist(
    (set) => ({
      isDarkMode: false,
      t: traslation["es"],
      toggleDarkMode: (value:string) =>
        set(() => ({
          isDarkMode: value,
        })),
      setLanguage: (value:string) =>
        set(() => ({
          t: traslation[value],
        })),
    }),
    { name: "theme" }
  )
)



