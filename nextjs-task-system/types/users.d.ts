export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string;
  createdAt: string;
  updatedAt: string;
  role: UserRole;
}

// Define la interfaz para la relación usuario-grupo
export interface UserGroup {
  id: string;
  userId: string;
  groupId: string;
  user: User; // El usuario relacionado
}

// Define la interfaz para el grupo
export interface Group {
  id: string;
  name: string;
  users: UserGroup[]; // Lista de relaciones usuario-grupo
}