import { NextRequest, NextResponse } from "next/server";
import { groupUsers, tasks } from "@/app/lib/data";

export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id')


    const userTasks = tasks.filter((task) => {
        const assignedToUser = task.assignedTo.id === userId;

        const assignedToGroup = task.assignedTo.id &&
            groupUsers.some(group => group.id === task.assignedTo.id && group.userIds.includes(userId))

        return assignedToGroup || assignedToUser
    });


    return NextResponse.json(userTasks, { status: 200 });
}
