import { CombinedOptions, Task, User, UserGroup, UserInput } from "./definitions";


export const users: User[] = [
    { id: "u-0", name: "Alejandro", email: 'correo@gmail.com', password: "alejandro123", role: "adm" },
    { id: "u-1", name: "Sofía", email: 'correo@gmail.com', password: "sofia123", role: "user" },
    { id: "u-2", name: "Alicia", email: 'correo@gmail.com', password: "alicia123", role: "user" },
    { id: "u-3", name: "Joaquín", email: 'correo@gmail.com', password: "joaquin123", role: "user" },
];

export const userInputs: UserInput[] = users.map(({ password, ...user }) => user);

export const groupUsers: UserGroup[] = [
    {
        id: "g-1",
        name: "Party Planners",
        userIds: ["u-1", "u-2"]
    },
    {
        id: "g-2",
        name: "Development Team",
        userIds: ["u-3"]
    },
];

export const tasks: Task[] = [
    {
        id: 1,
        title: "Plan Event",
        description: "Organize a party for the client.",
        assignedTo: userInputs[1],
        creationDate: "2024-12-01",
        dueDate: "2024-12-05",
        priority: "low",
        status: "pending",
        comments: []
    },
    {
        id: 2,
        title: "Build API",
        description: "Develop the backend for the new project.",
        assignedTo: groupUsers[0],
        creationDate: "2024-12-01",
        dueDate: "2024-12-10",
        priority: "high",
        status: "pending",
        comments: []
    },
    {
        id: 3,
        title: "Design UI",
        description: "Create mockups for the new dashboard.",
        assignedTo: userInputs[2],
        creationDate: "2024-12-02",
        dueDate: "2024-12-08",
        priority: "medium",
        status: "pending",
        comments: []
    },
];


const userOptions: CombinedOptions[] = userInputs.map((user) => ({
    id: user.id,
    name: user.name,
    type: 'user',
    value: user,
}));


const groupOptions: CombinedOptions[] = groupUsers.map((group) => ({
    id: group.id,
    name: group.name,
    type: 'group',
    value: group,
}));

export const combinedOptions: CombinedOptions[] = [
    ...userOptions,
    ...groupOptions,
];