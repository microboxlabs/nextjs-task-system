import prisma from '../../../../prisma/client';
import { validateToken } from '../../../utils/validateToken'

export async function GET(req, { params }) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }


    const { id } = params;

    try {
        const group = await prisma.group.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!group) {
            return new Response(JSON.stringify({ message: 'Group not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(group), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching group' }), { status: 500 });
    }
}

export async function PUT(req, { params }) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { id } = params;
    const data = await req.json();

    try {
        const updatedGroup = await prisma.group.update({
            where: {
                id: parseInt(id),
            },
            data: data,
        });

        return new Response(JSON.stringify(updatedGroup), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error updating group' }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { id } = params;

    try {
        const deletedGroup = await prisma.group.delete({
            where: {
                id: parseInt(id),
            },
        });

        return new Response(JSON.stringify(deletedGroup), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error deleting group' }), { status: 500 });
    }
}