import { Task } from "./definitions";

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