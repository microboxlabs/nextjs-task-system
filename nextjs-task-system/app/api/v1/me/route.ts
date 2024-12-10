import { NextRequest, NextResponse } from "next/server";
import { getAuthCookie } from "@/app/lib/cookies";
import { jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET_KEY || "your-secret-key");

export const GET = async (req: NextRequest) => {

    const token = getAuthCookie();
    if (!token) {
        return Response.json({ error: "Invalid login" }, { status: 400 });
    }
    try {
        const { payload } = await jwtVerify(token?.value, SECRET_KEY);
        const { id, email, role } = payload;
        return Response.json({ id, email, role }, { status: 200 });
    } catch (error) {
        console.error("Login error:", error)
        return Response.json({ error: "Invalid login" }, { status: 400 });
    }
};
