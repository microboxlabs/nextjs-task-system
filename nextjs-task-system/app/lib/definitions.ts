
export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
}

export type UserInput = Omit<User, "password" | "email">

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
    comments: string[]

}

export type CombinedOptions = {
    id: number | string;
    name: string;
    type: 'user' | 'group';
    value: UserInput | UserGroup;
};