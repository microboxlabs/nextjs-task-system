import { getServerSession } from "@/app/__mocks__/next-auth";
import prismaMock from "@/app/__mocks__/prisma";
import { GET, POST } from "@/app/api/groups/route";
import { NextResponse } from "next/server";

// Mock`next-auth`
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => prismaMock);

describe("API tests", () => {
  beforeAll(() => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { role: "Admin" },
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // clean mocks
  });

  //@ts-ignore
  const jsonMock = jest
    .spyOn(NextResponse, "json")
    //@ts-ignore
    .mockImplementation(() => {});

  describe("GET handler", () => {
    it("should return 401 if user is not admin", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { role: "User" },
      });

      const response = await GET();

      expect(getServerSession).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith(
        { error: "Unauthorized" },
        { status: 401 },
      );
    });

    it("should return 200 with groups if user is admin", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { role: "Admin" },
      });
      prismaMock.group.findMany.mockResolvedValueOnce([
        { id: 1, name: "Group 1" },
      ]);

      const response = await GET();

      expect(getServerSession).toHaveBeenCalledTimes(1);
      expect(prismaMock.group.findMany).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith([{ id: 1, name: "Group 1" }], {
        status: 200,
      });
    });
  });

  describe("POST handler", () => {
    it("should return 401 if user is not admin", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { role: "User" },
      });

      const request = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Group Name", userIds: [1] }),
      });

      const response = await POST(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith(
        { error: "Unauthorized" },
        { status: 401 },
      );
    });

    it("should return 400 if group name is missing", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { role: "Admin" },
      });

      const request = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIds: [1] }), // Falta el nombre del grupo
      });

      const response = await POST(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith(
        { error: "Group name is required" },
        { status: 400 },
      );
    });

    it("should return 201 with new group if input is valid", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { role: "Admin" },
      });
      prismaMock.group.create.mockResolvedValueOnce({
        id: 1,
        name: "New Group",
        members: [{ id: 1, userId: 1 }],
      });

      const request = new Request("http://localhost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New Group", userIds: [1] }),
      });

      const response = await POST(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      expect(prismaMock.group.create).toHaveBeenCalledWith({
        data: {
          name: "New Group",
          members: { create: [{ userId: 1 }] },
        },
        include: { members: true },
      });
      expect(jsonMock).toHaveBeenCalledWith(
        {
          id: 1,
          name: "New Group",
          members: [{ id: 1, userId: 1 }],
        },
        { status: 201 },
      );
    });
  });
});
