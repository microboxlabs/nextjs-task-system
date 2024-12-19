import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface User extends DefaultUser {
    role?: UserRole; // Agregamos el campo role
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      userId: string
      role: UserRole
    } & DefaultSession['user']
  }
}