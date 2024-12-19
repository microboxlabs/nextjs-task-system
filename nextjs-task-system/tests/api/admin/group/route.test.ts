import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import * as prismaUtils from "@/utils/prisma";
import { GET, POST, PUT, DELETE } from "@/app/api/admin/group/route";

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
        group: {
            findMany: vi.fn(),
            create: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
        },
        $disconnect: vi.fn(),
    },
}));

describe("Group Route API Endpoints", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => {}); //El endpoint tiene un console.error en el catch
    });

    afterEach(async () => {
        await prismaUtils.prisma.$disconnect();
    });

    describe("GET /api/admin/group", () => {
        it("should fetch groups successfully", async () => {
            const mockResponse = [
                { id: "1", name: "Group 1", users: [] },
                { id: "2", name: "Group 2", users: [] },
            ];
            vi.spyOn(prismaUtils.prisma.group, "findMany").mockResolvedValue(mockResponse);

            const req = new NextRequest("http://localhost/api/admin/group");
            const res = await GET(req);

            expect(res).toBeDefined(); // Asegura que la respuesta existe
            if (res) {
                expect(res.status).toBe(200);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual(mockResponse);
            }
        });

        it("should return error on database failure", async () => {
            vi.spyOn(prismaUtils.prisma.group, "findMany").mockRejectedValue(new Error("DB Error"));

            const req = new NextRequest("http://localhost/api/admin/group");
            const res = await GET(req);

            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(500);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Could not fetch groups with their users" });
            }
        });
    });

    describe("POST /api/admin/group", () => {
        it("should create a group successfully", async () => {
            const mockGroupResponse = { id: "1", name: "New Group", users: [] };
            vi.spyOn(prismaUtils.prisma.group, "create").mockResolvedValue(mockGroupResponse);

            const req = new NextRequest("http://localhost/api/admin/group", {
                method: "POST",
                body: JSON.stringify({
                    name: "Test Group",
                    userIds: ["123"],
                }),
            });

            const res = await POST(req);

            expect(res).toBeDefined();
            if(res){
                expect(res.status).toBe(201);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({
                    message: "Group created successfully",
                    newGroup: mockGroupResponse,
                });
            }
        });

        it("should fail if no name is provided", async () => {
            const req = new NextRequest("http://localhost/api/admin/group", {
                method: "POST",
                body: JSON.stringify({
                    userIds: ["123"],
                }),
            });

            const res = await POST(req);

            expect(res).toBeDefined();
            if(res){
                expect(res.status).toBe(400);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Missing required fields" });
            }
        });
    });

    describe("PUT /api/admin/group", () => {
        it("should update a group successfully", async () => {
            const mockUpdateResponse = {
                id: "1",
                name: "Updated Group",
                users: [],
            };

            vi.spyOn(prismaUtils.prisma.group, "update").mockResolvedValue(mockUpdateResponse);

            const req = new NextRequest("http://localhost/api/admin/group", {
                method: "PUT",
                body: JSON.stringify({
                    id: "1",
                    name: "Updated Group",
                    userIds: ["123"],
                }),
            });

            const res = await PUT(req);

            expect(res).toBeDefined();
            if(res){
                expect(res.status).toBe(200);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({
                    message: "Group updated successfully",
                    groupUpdated: mockUpdateResponse,
                });
            }
        });

        it("should fail if required fields are missing", async () => {
            const req = new NextRequest("http://localhost/api/admin/group", {
                method: "PUT",
                body: JSON.stringify({
                    userIds: ["123"],
                }),
            });

            const res = await PUT(req);
            expect(res).toBeDefined();
            if(res){
                expect(res.status).toBe(400);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({
                    error: "Missing required fields: 'id' and 'name'",
                });
            }
        });
    });

    describe("DELETE /api/admin/group", () => {
        it("should delete a group successfully", async () => {
            vi.spyOn(prismaUtils.prisma.group, "delete").mockResolvedValue({ id: "1", name: "Group 1" });

            const req = new NextRequest("http://localhost/api/admin/group?id=1", {
                method: "DELETE",
            });

            const res = await DELETE(req);
            
            expect(res).toBeDefined();
            if(res){
                expect(res.status).toBe(200);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ message: "Group deleted successfully" });
            }
        });

        it("should return an error if no groupId is provided", async () => {
            const req = new NextRequest("http://localhost/api/admin/group", {
                method: "DELETE",
            });

            const res = await DELETE(req);
            expect(res).toBeDefined();
            if(res){
                expect(res.status).toBe(400);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({ error: "Group ID is required" });
            }
        });
    });
});
