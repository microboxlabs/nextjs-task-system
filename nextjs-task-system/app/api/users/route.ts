// app/api/users/route.ts
import { NextResponse } from "next/server";
import { getUsersHandler } from "@/handlers/userHandlers";

export async function GET() {
  console.log("Received GET request for all users.");
  const result = await getUsersHandler();
  return NextResponse.json(result.json, { status: result.status });
}
