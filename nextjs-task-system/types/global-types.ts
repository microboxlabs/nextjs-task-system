export interface Response {
  message: string;
  status: number;
}

export interface User {
  email: string;
  exp: number;
  groupId: number;
  iat: number;
  rol: number;
  userId: number;
}
