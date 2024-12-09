import prisma from '../../../../../prisma/client';
import { validateToken } from '../../../../utils/validateToken';

export async function GET(req, { params }) {
    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { assignedToId, groupId } = params;

    try {
        const filters = [];
        if (assignedToId !== 'null') {
            filters.push({ assignedToId: parseInt(assignedToId) });
        }
        if (groupId !== 'null') {
            filters.push({ groupId: parseInt(groupId) });
        }

        const tasks = await prisma.task.findMany({
            where: {
                OR: filters.length > 0 ? filters : undefined,
            },
        });

        if (tasks.length === 0) {
            return new Response(JSON.stringify({ message: 'No tasks found' }), { status: 404 });
        }

        return new Response(JSON.stringify(tasks), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching tasks' }), { status: 500 });
    }
}