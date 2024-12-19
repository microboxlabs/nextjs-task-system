import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { DELETE, GET, POST } from "@/app/api/admin/task/route";
import { authorizeUser } from "@/utils/authUtils";
import * as prismaUtils from "@/utils/prisma";

// Mock para el `authorizeUser`
vi.mock("@/utils/authUtils", () => ({
    authorizeUser: vi.fn(() => ({
        status: 200,
        response: null,
    })),
}));

// Mock para Prisma
vi.mock("@/utils/prisma", () => ({
    prisma: {
        task: {
            findMany: vi.fn(),
            create: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}));

describe("Task Route API Endpoints", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(async () => {
        await prismaUtils.prisma.$disconnect();
    });

    describe("GET /api/admin/task", () => {
        it("should fetch tasks successfully", async () => {
            const mockResponse = [
                { id: 1, title: "Task 1", description: "Test task 1", assignedTo: "Test User", idAssignedTo: "1", dueDate: "2024-12-18T03:00:00.000Z", priority: "Low", status: "Pending", comments: "Comment 1", creationDate: "2024-12-18T00:00:00.000Z" },
                { id: 2, title: "Task 2", description: "Test task 2", assignedTo: "Test User 2", idAssignedTo: "2", dueDate: "2024-12-18T03:00:00.000Z", priority: "Medium", status: "In Progress", comments: "Comment 2", creationDate: "2024-12-18T00:00:00.000Z" },
                { id: 3, title: "Task 3", description: "Test task 3", assignedTo: "Test User 3", idAssignedTo: "3", dueDate: "2024-12-18T03:00:00.000Z", priority: "High", status: "Completed", comments: "Comment 3", creationDate: "2024-12-18T00:00:00.000Z" }
            ];
            vi.spyOn(prismaUtils.prisma.task, "findMany").mockResolvedValue(mockResponse);
    
            const req = new NextRequest("http://localhost/api/admin/task");
            const res = await GET(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(200);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual(mockResponse);
            }
        });
    
        it("should return error on database failure", async () => {
            vi.spyOn(prismaUtils.prisma.task, "findMany").mockRejectedValue(new Error("DB Error"));
    
            const req = new NextRequest("http://localhost/api/admin/task");
            const res = await GET(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(500);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Could not retrieve tasks" });
            }
        });
    });

    describe("POST /api/admin/task", () => {
        it("should create a task successfully", async () => {
            vi.spyOn(prismaUtils.prisma.task, "create").mockResolvedValue({ id: 1, title: "New Task", description: "Test Task description", assignedTo: "user_1", idAssignedTo: "1", dueDate: "2023-12-25T12:00:00Z", priority: "High", status: "Pending", comments: "", creationDate: "2023-12-25T12:00:00Z" });
    
            const req = new NextRequest("http://localhost/api/admin/task", {
                method: "POST",
                body: JSON.stringify({
                    title: "New Task",
                    description: "Test Task description",
                    assignedTo: "user_1",
                    idAssignedTo: "1",
                    dueDate: "2023-12-25T12:00:00Z",
                    priority: "High"
                }),
            });
    
            const res = await POST(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(201);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ message: "Task created successfully" });
            }
        });
    
        it("should return error if required fields are missing", async () => {
            const req = new NextRequest("http://localhost/api/admin/task", {
                method: "POST",
                body: JSON.stringify({
                    title: "Incomplete Task",
                    description: "Missing some fields"
                }),
            });
    
            const res = await POST(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(400);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Missing required fields" });
            }
        });
    
        it("should return error on database failure", async () => {
            vi.spyOn(prismaUtils.prisma.task, "create").mockRejectedValue(new Error("DB Error"));
    
            const req = new NextRequest("http://localhost/api/admin/task", {
                method: "POST",
                body: JSON.stringify({
                    title: "Fail Task",
                    description: "Should fail",
                    assignedTo: "user_1",
                    idAssignedTo: "1",
                    dueDate: "2023-12-25T12:00:00Z",
                    priority: "High"
                }),
            });
    
            const res = await POST(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(500);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Could not insert task" });
            }
        });
    });
    
    describe("DELETE /api/admin/task", () => {
        it("should delete a task successfully", async () => {
            vi.spyOn(prismaUtils.prisma.task, "delete").mockResolvedValue({ id: 1, title: "New Task", description: "Test Task description", assignedTo: "user_1", idAssignedTo: "1", dueDate: "2023-12-25T12:00:00Z", priority: "High", status: "Pending", comments: "", creationDate: "2023-12-25T12:00:00Z" });
    
            const req = new NextRequest("http://localhost/api/admin/task?id=1", {
                method: "DELETE",
            });
    
            const res = await DELETE(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(200);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ message: "Task deleted successfully" });
            }
        });
    
        it("should return error if no taskId is provided", async () => {
            const req = new NextRequest("http://localhost/api/admin/task", {
                method: "DELETE",
            });
    
            const res = await DELETE(req);
    
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(400);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Task ID is required" });
            }
        });
    
        it("should return error on database failure", async () => {
            vi.spyOn(prismaUtils.prisma.task, "delete").mockRejectedValue(new Error("DB Error"));
    
            const req = new NextRequest("http://localhost/api/admin/task?id=1", {
                method: "DELETE",
            });
    
            const res = await DELETE(req);
    
            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(500);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Could not delete task" });
            }
        });
    });
});


