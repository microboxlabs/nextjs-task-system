export type UserRole = "admin" | "user";

export interface UserGroup {
  id: number;
  name: string;
}

export interface User {
  id: number;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  group: UserGroup;
}

export interface UserCredentials {
  username: string;
  password: string;
}
