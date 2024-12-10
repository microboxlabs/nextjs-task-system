import { NextResponse } from "next/server";
import { createTaskHandler, getTasksHandler } from "@/handlers/taskHandlers";

export async function GET() {
  const result = await getTasksHandler();
  return NextResponse.json(result.json, { status: result.status });
}

export async function POST(request: Request) {
  const body = await request.json();
  const result = await createTaskHandler(body);
  return NextResponse.json(result.json, { status: result.status });
}
