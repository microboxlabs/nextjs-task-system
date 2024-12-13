export interface User {
  id: number;
  username: string;
  password: string;
  role: string;
  group: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
