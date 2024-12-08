import { NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { setAuthCookie } from "@/app/lib/cookies";

const prisma = new PrismaClient();

export const POST = async(req: NextRequest) => {
    const { email, password } = await req.json();
    const checkUser = await prisma.users.findUnique({
        where: { email }
    });
    if (!checkUser) {
        return Response.json({ error: 'User not found' }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, checkUser.password);
    if (!isPasswordValid) {
        return Response.json({ error: 'Invalid password' }, { status: 401 });
    }
    if (!process.env.SECRET_WORD) {
        throw new Error("SECRET_WORD is not defined");
    }
    try {
        const token = jwt.sign({ email }, process.env.SECRET_WORD, { expiresIn: '1d' });
        const id = checkUser.id;
        setAuthCookie(token);
        return Response.json({ token, id }, { status: 200 });
    } catch (error) {
        return Response.json({ error: 'Invalid login' }, { status: 400 });
    }
    
}



