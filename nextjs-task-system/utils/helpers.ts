import { Task } from "@/types/task";
type Filters = { 
    status?: string;
    priority?: string;
    assignedTo?: string;
    dueDate?: string;
    creationDate?: string;
};


export function getStatusColor(status: string): 'warning' | 'blue' | 'success' {
    switch (status) {
        case 'Pending':
            return 'warning';
        case 'In Progress':
            return 'blue';
        case 'Completed':
            return 'success';
        default:
            throw new Error(`Invalid status: ${status}`);
    }
}

export const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(date);
};

export function filterTasks(tasks: Task[], filters: Filters): Task[] {
    let filtered = tasks;

    if (filters.status) {
        filtered = filtered.filter(task => task.status === filters.status);
    }

    if (filters.priority) {
        filtered = filtered.filter(task => task.priority === filters.priority);
    }

    if (filters.assignedTo) {
        filtered = filtered.filter(task => task.assignedTo.includes(filters.assignedTo || ""));
    }

    if (filters.dueDate) {
        filtered = filtered.filter(task => task.dueDate === filters.dueDate);
    }

    if (filters.creationDate) {
        filtered = filtered.filter(task => task.creationDate === filters.creationDate);
    }

    return filtered;
}

export const getMinDate = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};