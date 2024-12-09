import prisma from '../../../prisma/client';
import { validateToken } from '../../utils/validateToken'

export async function POST(req) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { title, description, assignedToId, groupId, dueDate, priority } = await req.json();

    try {
        const task = await prisma.task.create({
            data: {
                title,
                description,
                assignedToId,
                groupId,
                dueDate,
                priority,
                status: 'Pending',
            },
        });

        return new Response(JSON.stringify(task), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function GET(req) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    try {
        const tasks = await prisma.task.findMany();

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

