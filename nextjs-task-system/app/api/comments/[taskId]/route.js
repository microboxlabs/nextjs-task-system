import prisma from '../../../../prisma/client';
import { validateToken } from '../../../utils/validateToken'

export async function GET(req, { params }) {
    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { taskId } = params;

    try {
        const comments = await prisma.comment.findMany({
            where: {
                taskId: parseInt(taskId),
            },
        });

        return new Response(JSON.stringify(comments), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching comments' }), { status: 500 });
    }
}