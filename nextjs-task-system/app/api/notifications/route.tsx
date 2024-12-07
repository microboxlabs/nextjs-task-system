import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    {
      /*verify the existence of the jwt token*/
    }
    const cookieStore = cookies();
    const tokenFromCookie = cookieStore.get("tokenLogin")?.value;
    const tokenFromHeaders = req.headers.get("Authorization")?.split(" ")[1];
    const token = tokenFromCookie || tokenFromHeaders;

    if (!token) {
      return NextResponse.json(
        { message: "Token not found in cookies" },
        { status: 401 },
      );
    }

    try {
      const { payload } = await jwtVerify(token, secret);
      verifyToken(payload);
      const { searchParams } = new URL(req.url);
      const userId = Number(searchParams.get("user"));
      const groupId = Number(searchParams.get("group"));
      const notifications = await prisma.notification.findMany({
        where: {
          // Use OR to match notifications based on either userId or groupId (or both)
          OR: [
            groupId ? { groupId: groupId } : {},
            userId ? { userId: userId } : {},
          ],
        },
        select: {
          id: true,
          createdAt: true,
          groupId: true,
          message: true,
          userId: true,
        },
      });
      if (notifications.length <= 0) {
        return NextResponse.json({
          message: "Succesful request",
          data: [],
          status: 200,
        });
      }
      return NextResponse.json({
        message: "Succesful request",
        data: notifications,
        status: 200,
      });
    } catch (error) {
      if (
        error instanceof Error &&
        "code" in error &&
        error.code === "EXPIRED-TOKEN"
      ) {
        return NextResponse.json({
          message: "Token has expired",
          data: [],
          status: 401,
        });
      }

      console.error(error);
      return NextResponse.json({
        message: "Invalid token",
        data: [],
        status: 401,
      });
    }
  } else {
    return NextResponse.json({
      message: "Invalid method",
      data: [],
      status: 405,
    });
  }
}
