import prisma from '../../../../prisma/client';
import { validateToken } from '../../../utils/validateToken'

export async function GET(req, { params }) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { id } = params;

    try {
        const task = await prisma.task.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!task) {
            return new Response(JSON.stringify({ message: 'Task not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(task), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching task' }), { status: 500 });
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
        const updatedTask = await prisma.task.update({
            where: {
                id: parseInt(id),
            },
            data: data,
        });

        return new Response(JSON.stringify(updatedTask), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error updating task' }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {

    const validation = validateToken(req);

    if (!validation.valid) {
        return new Response(JSON.stringify({ error: validation.message }), { status: 401 });
    }

    const { id } = params;

    try {
        const deletedTask = await prisma.task.delete({
            where: {
                id: parseInt(id),
            },
        });

        return new Response(JSON.stringify(deletedTask), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error deleting task' }), { status: 500 });
    }
}
