import prisma from '../../../prisma/client';

export async function POST(req) {
    const { name, email, password, role } = await req.json();

    try {
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password,
                role,
            },
        });

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}

export async function GET(req) {
    try {
        const users = await prisma.user.findMany();
        const usersWithoutPassword = users.map(({ password, ...user }) => user);

        return new Response(JSON.stringify(usersWithoutPassword), { status: 200 });

    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

}