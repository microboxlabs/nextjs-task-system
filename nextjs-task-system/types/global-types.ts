import { JWTPayload } from "jose";

export interface Response {
  message: string;
  status: number;
}

export interface User extends JWTPayload {
  email: string;
  exp: number;
  groupId: number;
  iat: number;
  rol: number;
  userId: number;
}
