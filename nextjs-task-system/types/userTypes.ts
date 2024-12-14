export interface User {
  id: number;
  username: string;
  password: string;
  name: string;
  role: string;
  group: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}
