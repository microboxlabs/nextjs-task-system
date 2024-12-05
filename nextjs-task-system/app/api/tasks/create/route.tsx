import { verifyToken } from "@/actions/token/token-actions";
import prisma from "@/lib/prisma";
import { Task } from "@/types/tasks-types";
import { jwtVerify } from "jose";

import { NextRequest, NextResponse } from "next/server";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function POST(req: NextRequest) {
    //Send data to sqlLite and returns the same data to the front to post the card
    if (req.method === 'POST') {
        const { title, description, assigned, typeOfAssigned, priority, token } = await req.json();
        try {

            if (!token) {
                return NextResponse.json(
                    { message: "Token not found in cookies" },
                    { status: 401 }
                );
            }
            try {
                const { payload } = await jwtVerify(token, secret);
                verifyToken(payload);
            } catch (error) {
                if (error instanceof Error && 'code' in error && error.code === 'EXPIRED-TOKEN') {
                    return NextResponse.json({ message: "Token has expired", data: [], status: 401 });
                }
                console.error(error);
                return NextResponse.json({ message: "Internal server error", data: [], status: 500 });
            }
            const task = await prisma.task.create({
                data: {
                    title: title,
                    description: description,
                    assignedToGroupId: typeOfAssigned !== 'person' ? assigned : null,
                    assignedToUserId: typeOfAssigned === 'person' ? assigned : null,
                    priorityId: priority,
                },
                include: {
                    group: {
                        select: {
                            name: true, 
                        },
                    },
                    user: {
                        select: {
                            name: true,
                        },
                    },
                    priority: {
                        select: {
                            name: true,
                        },
                    },
                    status: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            const formattedTask: Task = {
                id: task.id,
                title: task.title,
                status: task.status.name,
                user: task.user ? task.user.name : undefined,
                group: task.group ? task.group.name : undefined,
                dueDate: task.dueDate,
                priority: task.priority.name,
            };
            return NextResponse.json({
                message: "Task created successfully",
                data: formattedTask,
                status: 200,
            });
        } catch (error) {
            if (error instanceof Error && 'code' in error && error.code === 'EXPIRED-TOKEN') {
                return NextResponse.json({ message: "Token has expired", data: [], status: 401 });
            }

            console.error(error)
            return NextResponse.json({ message: "Internal server error", data: [], status: 500 });
        }
    } else {
        return NextResponse.json({ message: "Internal server error", data: [], status: 401 });
    }

}
