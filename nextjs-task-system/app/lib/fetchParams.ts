import { NextRequest, NextResponse } from "next/server";
import { tasks, userInputs, groupUsers } from "./data";
import { Task } from "./definitions";
import { revalidatePath } from "next/cache";

export async function fetchParams(query: string): Promise<Task[]> {

    const url = new URL("http://localhost:3000/api/tasks/admin");
    if (query) {
        url.searchParams.append("query", query);
    }

    const response = await fetch(url.toString(), { cache: "no-store" });

    if (!response.ok) {
        throw new Error('Failed to fetch tasks')
    }
    return response.json();
}


export async function createTask(data: Task) {
    try {
        const response = await fetch("http://localhost:3000/api/tasks/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Failed to submit the task. Please try again");
        }

        return response.json();
    } catch (error: any) {
        throw new Error(error.message || "Something went wrong");
    }
}


export async function deleteTask(taskId: number) {

    const response = await fetch(`/api/tasks/admin?id=${taskId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete task')
    }
    revalidatePath('/dashboard/tasks');
    return response.json();

}


export async function updateTask(taskId: number, data: Task) {

    const response = await fetch(`/api/tasks/admin?id=${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('Failed to delete task')
    }
    revalidatePath('/dashboard/tasks');
    const updatedTask = await response.json();
    return updatedTask;

}