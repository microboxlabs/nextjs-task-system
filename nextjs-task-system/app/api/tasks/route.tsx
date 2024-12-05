import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("tokenLogin")?.value;

  if (!token) {
    return NextResponse.json(
      { message: "Token not found in cookies" },
      { status: 401 }
    );
  }
  if (req.method === 'GET') {
    try {
      const { payload } = await jwtVerify(token, secret);
      verifyToken(payload)



      const tasks = await prisma.task.findMany({
        include: {
          priority: { select: { name: true } },
          status: { select: { name: true } },
          user: { select: { name: true } },
          group: { select: { name: true } },
        },
      });

      if (!tasks || tasks.length === 0) {
        return NextResponse.json(
          { message: "No tasks found", data: [], status: 404 }
        );
      }


      return NextResponse.json({ message: "Succesful request", data: tasks, status: 500 });

    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 'EXPIRED-TOKEN') {
        return NextResponse.json({ message: "Token has expired", data: [], status: 401 });
      }


      console.error(error);
      return NextResponse.json({ message: "Invalid token", data: [], status: 401 });
    }
  } else {
    return NextResponse.json({ message: "Invalid method", data: [], status: 405 });
  }
}
