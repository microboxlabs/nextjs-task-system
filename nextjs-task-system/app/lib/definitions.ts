
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'user' | 'adm'
}

export type UserInput = Omit<User, "password" | "email" | "role">

export type UserGroup = {
    id: string;
    name: string;
    userIds: number[];
}


export type Task = {
    id: number;
    title: string;
    description: string;
    assignedTo: UserInput | UserGroup;
    creationDate: string;
    dueDate: string;
    priority: "low" | "medium" | "high";
    status: "pending" | "in progress" | "completed";
    comments: Comment[]

}

export type CombinedOptions = {
    id: number | string;
    name: string;
    type: 'user' | 'group';
    value: UserInput | UserGroup;
};

export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
}