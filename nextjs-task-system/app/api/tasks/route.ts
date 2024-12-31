import { NextResponse } from "next/server";
import { createTaskHandler, getTasksHandler } from "@/handlers/taskHandlers";

export async function GET() {
  console.log("Received GET request for all tasks.");
  const result = await getTasksHandler();
  return NextResponse.json(result.json, { status: result.status });
}

export async function POST(request: Request) {
  console.log("Received POST request to create a task.");
  const result = await createTaskHandler(request);
  return NextResponse.json(result.json, { status: result.status });
}
