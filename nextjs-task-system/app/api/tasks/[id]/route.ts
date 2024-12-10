import { NextResponse } from "next/server";
import {
  getTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from "@/handlers/taskHandlers";

export async function GET({ params }: { params: { id: string } }) {
  const result = await getTaskHandler(params.id);
  return NextResponse.json(result.json, { status: result.status });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const body = await request.json();
  const result = await updateTaskHandler(params.id, body);
  return NextResponse.json(result.json, { status: result.status });
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  const result = await deleteTaskHandler(params.id);
  return NextResponse.json(result.json, { status: result.status });
}
