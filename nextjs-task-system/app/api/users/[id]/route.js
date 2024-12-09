// app/api/users/[id]/route.js
import prisma from '../../../../prisma/client';
import bcrypt from 'bcrypt';

export async function GET(req, { params }) {
    const { id } = params;

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: parseInt(id),
            },
        });

        if (!user) {
            return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
        }

        const { password, ...userWithoutPassword } = user;

        return new Response(JSON.stringify(userWithoutPassword), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error fetching user' }), { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const { id } = params;
    const data = await req.json();

    try {

        if (data.password) {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            data.password = hashedPassword;
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: parseInt(id),
            },
            data: data,
        });

        return new Response(JSON.stringify(updatedUser), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error updating user' }), { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const { id } = params;

    try {
        const deletedUser = await prisma.user.delete({
            where: {
                id: parseInt(id),
            },
        });

        return new Response(JSON.stringify(deletedUser), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error deleting user' }), { status: 500 });
    }
}
