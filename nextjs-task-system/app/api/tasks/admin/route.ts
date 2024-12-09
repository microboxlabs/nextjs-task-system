import { groupUsers, tasks, userInputs, users } from "@/app/lib/data";
import { Task } from "@/app/lib/definitions";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    let nextId = tasks.length + 1;

    const body = await req.json();

    let assignedTo = userInputs.find(user => user.id === body.assignedTo);

    if (!assignedTo) {
        assignedTo = groupUsers.find(group => group.id === body.assignedTo);
    }

    const newTask: Task = {
        id: nextId,
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
    console.log(nextId)
    return NextResponse.json({ message: 'Task created', newTask }, { status: 200 })
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query')?.toLowerCase() || ""

    const filteredTasks = tasks.filter(
        (task) =>
            task.title.toLowerCase().includes(query) ||
            task.assignedTo.name.toLowerCase().includes(query) ||
            task.status.toLocaleLowerCase().includes(query)

    )

    return NextResponse.json(filteredTasks, { status: 200 })
}

export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
        return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
    }

    const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));

    if (taskIndex === -1) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    tasks.splice(taskIndex, 1);
    revalidatePath('/dashboard/tasks');
    return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
}


export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get('id');

    if (!taskId) {
        return NextResponse.json({ message: 'Task ID is required' }, { status: 400 });
    }

    const body = await req.json();

    const taskIndex = tasks.findIndex(task => task.id === parseInt(taskId));

    if (taskIndex === -1) {
        return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    const updatedTask: Task = {
        ...tasks[taskIndex],
        title: body.title || tasks[taskIndex].title,
        description: body.description || tasks[taskIndex].description,
        assignedTo: userInputs.find(user => user.id === body.assignedTo) || groupUsers.find(group => group.id === body.assignedTo) || tasks[taskIndex].assignedTo,
        dueDate: body.dueDate || tasks[taskIndex].dueDate,
        priority: body.priority || tasks[taskIndex].priority,
        status: body.status || tasks[taskIndex].status,
    };

    tasks[taskIndex] = updatedTask;
    revalidatePath('/dashboard/tasks');
    return NextResponse.json({ message: 'Task updated successfully' }, { status: 200 });
}