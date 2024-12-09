import db from "./db";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export async function getCurrentUser() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      credentials: "include",
    });

    if (!response.ok) return null;
    return response.json() as Promise<User | null>;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
