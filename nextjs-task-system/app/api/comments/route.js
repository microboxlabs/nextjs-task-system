import prisma from '../../../prisma/client';
import { validateToken } from '../../utils/validateToken'

export async function POST(req) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { content, taskId, createdById } = await req.json();

    try {
        const comment = await prisma.comment.create({
            data: {
                content,
                taskId,
                createdById,
            },
        });

        return new Response(JSON.stringify(comment), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

