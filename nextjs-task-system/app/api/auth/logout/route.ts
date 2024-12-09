import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import db from "@/Utils/db";

export async function POST() {
  try {
    const sessionId = (await cookies()).get("sessionId")?.value;

    if (sessionId) {
      // Eliminar la sesión de la base de datos
      db.prepare("DELETE FROM sessions WHERE id = ?").run(sessionId);

      // Eliminar la cookie
      (await cookies()).delete("sessionId");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Error during logout" }, { status: 500 });
  }
}
