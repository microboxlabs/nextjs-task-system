import { NextResponse } from "next/server";
import { tasksAdapter } from "@/adapters/tasksAdapter";
import {
  taskSchema,
  updateTaskSchema,
  deleteTaskSchema,
} from "@/schemas/taskSchema";

export async function GET() {
  try {
    // Fetching tasks from the adapter
    const tasks = await tasksAdapter.fetchTasks();
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    // Handle task not found error
    if ((error as Error).message === "Task not found") {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 },
      );
    }
    // General error handling: return a 500 status code if an error occurs
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Input validation using taskSchema
    const parsedBody = taskSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: parsedBody.error.format() },
        { status: 400 },
      );
    }

    // Passing validated data to the adapter to create a new task
    const newTask = await tasksAdapter.createTask(body);
    return NextResponse.json({ success: true, data: newTask }, { status: 201 });
  } catch (error) {
    // Error handling: return a 500 status code if an error occurs
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    // Input validation using updateTaskSchema
    const parsedBody = updateTaskSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json(
        { success: false, error: parsedBody.error.format() },
        { status: 400 },
      );
    }

    const { id, ...updatedData } = body;
    // Passing the validated data to the adapter to update the task
    const updatedTask = await tasksAdapter.updateTask(Number(id), updatedData);

    // If no task is updated (i.e., the task does not exist), return 404
    if (!updatedTask) {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, data: updatedTask });
  } catch (error) {
    // Check if the error is related to "Task not found" and return 404
    if ((error as Error).message === "Task not found") {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 },
      );
    }

    // For other errors, return 500 Internal Server Error
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // Input validation using deleteTaskSchema
    const parsedId = deleteTaskSchema.safeParse({ id });
    if (!parsedId.success) {
      return NextResponse.json(
        { success: false, error: parsedId.error.format() },
        { status: 400 },
      );
    }

    // Passing the validated id to the adapter to delete the task
    await tasksAdapter.deleteTask(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    // Handle task not found error
    if ((error as Error).message === "Task not found") {
      return NextResponse.json(
        { success: false, error: "Task not found" },
        { status: 404 },
      );
    }
    // General error handling: return a 500 status code if an error occurs
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
