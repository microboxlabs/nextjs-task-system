import { tasks } from "@/app/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { taskId: string } }) {
    try {
        const { taskId } = params;
        const { status } = await req.json();


        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 });
        }

        const task = tasks.find((task) => task.id === +taskId);
        if (!task) {
            return NextResponse.json({ error: "Task not found" }, { status: 404 });
        }

        task.status = status;

        return NextResponse.json({ success: true, updatedTask: task });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
    }
}
