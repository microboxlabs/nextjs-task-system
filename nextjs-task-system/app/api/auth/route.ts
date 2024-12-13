// app/api/auth/route.ts
import { NextResponse } from "next/server";
import { authenticateUser } from "@/handlers/authHandlers"; // Asegúrate de que la ruta sea correcta

export async function POST(request: Request) {
  console.log("Received POST request for authentication.");
  const result = await authenticateUser(request);
  return NextResponse.json(result.json, { status: result.status });
}
