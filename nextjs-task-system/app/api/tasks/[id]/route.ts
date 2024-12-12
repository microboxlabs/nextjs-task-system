import { NextResponse } from "next/server";
import {
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "@/handlers/taskHandlers";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("Received GET request for a task with ID:", params.id);
  const result = await getTaskHandler(request, params);
  return NextResponse.json(result.json, { status: result.status });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("Received PUT request to update task with ID:", params.id);
  const result = await updateTaskHandler(request, params);
  return NextResponse.json(result.json, { status: result.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  console.log("Received DELETE request to delete task with ID:", params.id);
  const result = await deleteTaskHandler(request, params);
  return NextResponse.json(result.json, { status: result.status });
}
