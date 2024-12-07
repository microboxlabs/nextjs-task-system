import { groupUsers, tasks, userInputs, users } from "@/app/lib/data";
import { Task } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

let nextId = tasks.length + 1;

export async function POST(req: Request) {
    const body = await req.json();

    let assignedTo = userInputs.find(user => user.id === body.assignedTo);

    if (!assignedTo) {
        assignedTo = groupUsers.find(group => group.id === body.assignedTo);
    }


    const newTask: Task = {
        id: tasks.length + 1,
        title: body.title,
        description: body.description,
        assignedTo,
        creationDate: new Date().toISOString().split('T')[0],
        dueDate: body.dueDate,
        priority: body.priority,
        status: "pending",
        comments: [],
    };
    tasks.push(newTask)
    return NextResponse.json({ message: 'Task created' }, { status: 200 })
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase() || ""

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(query) ||
            task.assignedTo.name.toLowerCase().includes(query) ||
            task.status.toLocaleLowerCase().includes(query)

    )
    revalidatePath('/dashboard/tasks')

    return NextResponse.json(filteredTasks, { status: 200 })
}