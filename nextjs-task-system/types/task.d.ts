export type PriorityType = 'Low' | 'Medium' | 'High';
export type StatusType = 'Pending' | 'In Progress' | 'Completed'

export interface Task {
    id: number;
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    priority: PriorityType;
    status: StatusType;
    comments: string;
    idAssignedTo: string;
    creationDate: string;
}