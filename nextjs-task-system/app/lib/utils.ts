import "dotenv/config";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return `${date}`.split("T")[0];
}

export const config = {
  dbUrl: process.env.DATABASE_URL || "",
  testUserId: process.env.TEST_USER_ID || "",
  redirectURI: process.env.REDIRECT_URI || "http://localhost:3000",
};
