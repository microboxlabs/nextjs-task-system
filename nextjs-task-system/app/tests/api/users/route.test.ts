import { getServerSession } from "@/app/__mocks__/next-auth";
import prismaMock from "@/app/__mocks__/prisma";
import { GET } from "@/app/api/users/route";
import { NextResponse } from "next/server";

// Mock `next-auth`
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock Prisma
jest.mock("@/lib/prisma", () => prismaMock);

describe("API tests", () => {
  beforeAll(() => {
    (getServerSession as jest.Mock).mockResolvedValue({
      user: { id: "1", role: "Admin" },
    });
  });

  afterEach(() => {
    jest.clearAllMocks(); // clean
  });

  const jsonMock = jest
    .spyOn(NextResponse, "json")
    //@ts-ignore
    .mockImplementation(() => {});

  describe("GET handler", () => {
    it("should return 401 if user is not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({ user: null });

      const request = new Request("http://localhost", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await GET(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      expect(jsonMock).toHaveBeenCalledWith(
        { error: "Unauthorized" },
        { status: 401 },
      );
    });

    it("should return 200 with user data if user is authenticated", async () => {
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
      ];

      //@ts-ignore
      prismaMock.user.findMany.mockResolvedValueOnce(mockUsers);

      const request = new Request("http://localhost", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await GET(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      //@ts-ignore

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        where: undefined,
      });
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });

    it("should return 200 with only the authenticated user's data if user is not admin", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { id: "1", role: "User" },
      });
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
      ];
      //@ts-ignore

      prismaMock.user.findMany.mockResolvedValueOnce(mockUsers);

      const request = new Request("http://localhost", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await GET(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      //@ts-ignore

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        where: { id: 1 },
      });
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });

    it("should return 200 with all users data if user is admin", async () => {
      (getServerSession as jest.Mock).mockResolvedValueOnce({
        user: { id: "1", role: "Admin" },
      });
      const mockUsers = [
        { id: 1, name: "John Doe", email: "john@example.com", role: "User" },
        { id: 2, name: "Jane Doe", email: "jane@example.com", role: "Admin" },
      ];
      //@ts-ignore

      prismaMock.user.findMany.mockResolvedValueOnce(mockUsers);

      const request = new Request("http://localhost", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const response = await GET(request);

      expect(getServerSession).toHaveBeenCalledTimes(1);
      //@ts-ignore

      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
        where: undefined,
      });
      expect(jsonMock).toHaveBeenCalledWith(mockUsers);
    });
  });
});
