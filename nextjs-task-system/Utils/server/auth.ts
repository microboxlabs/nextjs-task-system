import { cookies } from "next/headers";
import db from "../db";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export async function getCurrentUserServer(): Promise<User | null> {
  const sessionId = (await cookies()).get("sessionId")?.value;

  console.log("Debug - sessionId:", sessionId); // Temporary debug log

  if (!sessionId) {
    return null;
  }

  try {
    const user = db
      .prepare(
        `SELECT u.id, u.email, u.first_name, u.last_name, u.role 
         FROM sessions s
         JOIN users u ON s.user_id = u.id
         WHERE s.id = ? AND s.created_at > datetime('now', '-24 hours')`,
      )
      .get(sessionId);

    return user as User | null;
  } catch (error) {
    console.error("Database error:", error);
    return null;
  }
}
