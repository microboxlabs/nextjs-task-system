import users from "@/data/users_seed.json";
import { User } from "@/types/userTypes";

let userList = [...users]; // Simulating an in-memory database

export const usersAdapter = {
  getUsers: async (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(userList);
      }, 100);
    });
  },

  findUserByUsername: async (username: string): Promise<User | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = userList.find((user) => user.username === username);
        resolve(user);
      }, 100);
    });
  },

  validateUser: async (
    username: string,
    password: string,
  ): Promise<User | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = userList.find(
          (user) => user.username === username && user.password === password,
        );
        resolve(user || null);
      }, 100);
    });
  },

  isAdmin: (user: User): boolean => {
    return user && user.role === "admin";
  },

  isRegularUser: (user: User): boolean => {
    return user && user.role === "user";
  },
};
