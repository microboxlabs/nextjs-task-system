import { NextApiRequest, NextApiResponse } from "next";
import { cookies } from "next/headers";
import db from "@/Utils/db";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const sessionId = (await cookies()).get("sessionId")?.value;

  if (!sessionId) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const user = db
    .prepare(
      `SELECT u.id, u.email, u.first_name, u.last_name, u.role 
       FROM sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.id = ? AND s.created_at > datetime('now', '-24 hours')`,
    )
    .get(sessionId) as User | undefined;

  if (!user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  return res.status(200).json(user);
}
