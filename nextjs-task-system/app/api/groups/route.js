import prisma from '../../../prisma/client';
import { validateToken } from '../../utils/validateToken'

export async function POST(req) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { name } = await req.json();

    try {
        const group = await prisma.group.create({
            data: {
                name,
            },
        });

        return new Response(JSON.stringify(group), { status: 201 });
    }
    catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function GET(req) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const groups = await prisma.group.findMany();

    return new Response(JSON.stringify(groups), { status: 200 });
}