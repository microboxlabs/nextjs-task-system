import { NextResponse } from "next/server";
import { tasksAdapter } from "@/adapters/tasksAdapter";
import { taskSchema } from "@/schemas/taskSchema";
import { formatValidationErrorResponse } from "@/utils/validationErrorUtils";

export async function GET() {
  try {
    // Fetching tasks from the adapter
    const tasks = await tasksAdapter.fetchTasks();
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
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
        formatValidationErrorResponse(parsedBody.error),
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
