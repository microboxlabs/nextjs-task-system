import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/admin/user/route";
import * as prismaUtils from "@/utils/prisma";
import bcrypt from "bcryptjs";

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
        user: {
            findMany: vi.fn(),
            create: vi.fn()
        },
        $disconnect: vi.fn(),
    },
}));

describe("User Route API Endpoints", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(console, "error").mockImplementation(() => { });
    });

    afterEach(async () => {
        await prismaUtils.prisma.$disconnect();
        vi.restoreAllMocks();
    });

    describe("GET /api/admin/user", () => {
      it("should fetch users successfully", async () => {
        const mockUsers = [
          { id: "1", name: "Bill Doe", email: "bill@example.com", emailVerified: null, image: "", createdAt: new Date("2024-12-01T00:00:00.000Z").toISOString(), updatedAt: new Date("2024-12-02T00:00:00.000Z").toISOString(), role: "admin", password: "" },
          { id: "2", name: "Jane Smith", email: "jane@example.com", emailVerified: null, image: "", createdAt: new Date("2024-12-01T00:00:00.000Z").toISOString(), updatedAt: new Date("2024-12-02T00:00:00.000Z").toISOString(), role: "user", password: "" },
        ];
        vi.spyOn(prismaUtils.prisma.user, "findMany").mockResolvedValue(mockUsers as any); //types de createdAt y updatedAt
  
        const req = new NextRequest("http://localhost/api/admin/user");
        const res = await GET(req);
  
        expect(res).toBeDefined();
        if (res) {
          expect(res.status).toBe(200);
          const jsonResponse = await res.json();
          expect(jsonResponse).toEqual(mockUsers);
        }
      });
  
      it("should return error on database failure", async () => {
        vi.spyOn(prismaUtils.prisma.user, "findMany").mockRejectedValue(new Error("DB Error"));
  
        const req = new NextRequest("http://localhost/api/admin/user");
        const res = await GET(req);
  
        expect(res).toBeDefined();
        if (res) {
          expect(res.status).toBe(500);
          const jsonResponse = await res.json();
          expect(jsonResponse).toEqual({ error: "Could not retrieve users" });
        }
      });
    });

    describe("POST /api/admin/user", () => {
        it("should create a user successfully", async () => {
            const mockTaskResponse = { id: "1", name: "Bill Doe", email: "bill@example.com", emailVerified: null, image: "", createdAt: new Date("2024-12-01T00:00:00.000Z").toISOString(), updatedAt: new Date("2024-12-02T00:00:00.000Z").toISOString(), role: "admin", password: "hashedpassword" };
            vi.spyOn(prismaUtils.prisma.user, "create").mockResolvedValue(mockTaskResponse as any);

            const req = new NextRequest("http://localhost/api/admin/user", {
                method: "POST",
                body: JSON.stringify({
                    name: "Bill Doe",
                    email: "bill@example.com",
                    password: "hashedpassword",
                    role: "user"
                }),
            });

            const res = await POST(req);

            expect(res).toBeDefined();
            if (res) {
                expect(res.status).toBe(201);
                const jsonResponse = await res.json();
                expect(jsonResponse).toEqual({
                    message: "User created successfully",
                    newUser: mockTaskResponse,
                });
            }
        });

        it("should return error when required fields are missing", async () => {
          const incompleteRequestBody = { name: "Missing Fields" };
    
          const req = new NextRequest("http://localhost/api/admin/user", {
            method: "POST",
            body: JSON.stringify(incompleteRequestBody),
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
          const mockRequestBody = {
            name: "New User",
            email: "newuser@example.com",
            password: "securepassword",
            role: "user",
          };
    
          //vi.spyOn(bcrypt, "hash").mockResolvedValue("hashedpassword");
          vi.spyOn(prismaUtils.prisma.user, "create").mockRejectedValue(new Error("DB Error"));
    
          const req = new NextRequest("http://localhost/api/admin/user", {
            method: "POST",
            body: JSON.stringify(mockRequestBody),
          });
          const res = await POST(req);
    
          expect(res).toBeDefined();
          if (res) {
            expect(res.status).toBe(500);
            const jsonResponse = await res.json();
            expect(jsonResponse).toEqual({ error: "Could not insert Group" });
          }
        });
    });
});
