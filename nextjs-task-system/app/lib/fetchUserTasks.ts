import { Task } from "./definitions";

export async function FetchUserTasks(id: string): Promise<Task[]> {

    const url = new URL(`http://localhost:3000/api/tasks/users`);
    if (id) {
        url.searchParams.append("id", id);
    }
    try {
        const response = await fetch(url.toString(), {
            cache: "no-store",
            credentials: "include",

        });

        if (!response.ok) {
            throw new Error('Failed to fetch tasks')
        }

        return response.json();
    } catch (error) {
        console.log(error)
        return []
    }

}
