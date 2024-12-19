import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, PUT } from "@/app/api/user/route";
import { authorizeUser } from "@/utils/authUtils";
import * as prismaUtils from "@/utils/prisma";

// Mock para el `authorizeUser`
vi.mock("@/utils/authUtils", () => ({
    authorizeUser: vi.fn(() => ({
        status: 200,
        response: null,
        session: {
            user: {
                userId: "1"
            }
        }
    })),
}));

// Mock para Prisma
vi.mock("@/utils/prisma", () => ({
    prisma: {
        task: {
            findMany: vi.fn(),
            update: vi.fn(),
            findUnique: vi.fn(),
        },
        userGroup: {
            findMany: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}));

describe("Task Route API Endpoints", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(async () => {
        await prismaUtils.prisma.$disconnect();
    });

    describe("GET /api/user", () => {
        it("should fetch tasks successfully", async () => {
            // Mocking tasks for the user
            const mockUserTasks = [
                { id: 1, title: "Task 1", description: "Test task 1", assignedTo: "Test User", idAssignedTo: "1", dueDate: "2024-12-18T03:00:00.000Z", priority: "Low", status: "Pending", comments: "Comment 1", creationDate: "2024-12-18T00:00:00.000Z" },
                { id: 2, title: "Task 2", description: "Test task 2", assignedTo: "Test User", idAssignedTo: "1", dueDate: "2024-12-18T03:00:00.000Z", priority: "Medium", status: "In Progress", comments: "Comment 2", creationDate: "2024-12-18T00:00:00.000Z" },
                { id: 3, title: "Task 3", description: "Test task 3", assignedTo: "Test User", idAssignedTo: "1", dueDate: "2024-12-18T03:00:00.000Z", priority: "High", status: "Completed", comments: "Comment 3", creationDate: "2024-12-18T00:00:00.000Z" }
            ];

            // Mocking tasks for the user groups
            const mockGroupTasks = [
                { id: 4, title: "Group Task 1", description: "Group task 1", assignedTo: "Group User", idAssignedTo: "2", dueDate: "2024-12-19T03:00:00.000Z", priority: "Low", status: "Pending", comments: "Group Comment 1", creationDate: "2024-12-18T00:00:00.000Z" },
                { id: 5, title: "Group Task 2", description: "Group task 2", assignedTo: "Group User", idAssignedTo: "2", dueDate: "2024-12-19T03:00:00.000Z", priority: "Medium", status: "In Progress", comments: "Group Comment 2", creationDate: "2024-12-18T00:00:00.000Z" },
                { id: 6, title: "Group Task 3", description: "Group task 3", assignedTo: "Group User", idAssignedTo: "2", dueDate: "2024-12-19T03:00:00.000Z", priority: "High", status: "Completed", comments: "Group Comment 3", creationDate: "2024-12-18T00:00:00.000Z" }
            ];

            // Mock Prisma task response
            vi.spyOn(prismaUtils.prisma.task, "findMany").mockResolvedValue(mockUserTasks); // Mock user tasks
            vi.spyOn(prismaUtils.prisma.userGroup, "findMany").mockResolvedValue([{ groupId: "2" }] as any); // Mock user group with groupId = 2 
            vi.spyOn(prismaUtils.prisma.task, "findMany").mockResolvedValueOnce(mockGroupTasks); // Mock group tasks

            // Simulate the request
            const req = new NextRequest("http://localhost/api/user");
            const res = await GET(req);

            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(200);

                const combinedTasks = [
                    ...mockUserTasks,
                    ...mockGroupTasks
                ];

                const jsonResponse = await res.json();

                // Asegúrate de que las tareas estén correctamente combinadas sin duplicarse
                expect(jsonResponse).toEqual(expect.arrayContaining(combinedTasks));
                expect(jsonResponse.length).toBe(combinedTasks.length);
            }
        });

        it("should return error on database failure", async () => {
            vi.spyOn(prismaUtils.prisma.task, "findMany").mockRejectedValue(new Error("DB Error"));

            const req = new NextRequest("http://localhost/api/user");
            const res = await GET(req);

            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(500);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Could not delete Group" }); // Actualiza el mensaje esperado
            }
        });
    });

    describe("PUT /api/user", () => {
        it("should update a task successfully", async () => {
            const mockTaskUpdated = { id: 1, title: "New Task", description: "Test Task description", assignedTo: "user_1", idAssignedTo: "1", dueDate: "2023-12-25T12:00:00Z", priority: "High", status: "Pending", comments: "", creationDate: "2023-12-25T12:00:00Z" };
            vi.spyOn(prismaUtils.prisma.task, "update").mockResolvedValue(mockTaskUpdated);
    
            const req = new NextRequest("http://localhost/api/user", {
                method: "PUT",
                body: JSON.stringify({
                    id: 1,
                    comments: "Test Task description"
                }),
            });
    
            const res = await PUT(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(200);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ message: "Task updated successfully", taskUpdated:mockTaskUpdated });
            }
        });
    
        it("should return error if required fields are missing", async () => {
            const req = new NextRequest("http://localhost/api/user", {
                method: "PUT",
                body: JSON.stringify({
                    comments: "Incomplete Task"
                }),
            });
    
            const res = await PUT(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(400);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Missing required fields: 'id' and 'comments'" });
            }
        });
    
        it("should return error on database failure", async () => {
            vi.spyOn(prismaUtils.prisma.task, "update").mockRejectedValue(new Error("DB Error"));
    
            const req = new NextRequest("http://localhost/api/user", {
                method: "PUT",
                body: JSON.stringify({
                    id: 1,
                    comments: "Fail Task"
                }),
            });
    
            const res = await PUT(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(500);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Could not update Task" });
            }
        });
    });

});

