import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(req: NextRequest) {
    if (req.method === 'GET') {
        const cookieStore =  cookies();
        const token = cookieStore.get("tokenLogin")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Token not found in cookies" },
                { status: 401 }
            );
        }

        try {
            const { payload } = await jwtVerify(token, secret);
            verifyToken(payload)

            const groups = await prisma.group.findMany({
                select: {
                    id: true,
                    name: true,
                },
            });

            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true
                },
            });

            const priorities = await prisma.priority.findMany({
                select: {
                    id: true,
                    name: true,
                }
            });

            if (users && groups && priorities) {
                const data = {
                    users: users,
                    groups: groups,
                    priorities: priorities
                };
                return NextResponse.json({
                    message: "Succesful request",
                    data: data,
                    status: 200,
                });
            }

            return NextResponse.json({ message: "Internal server error", data: [], status: 500 });

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
