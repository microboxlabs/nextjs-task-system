import NextAuth, { type DefaultSession, User  } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      isAdmin: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    isAdmin: boolean;
  }
}