import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/app/lib/cookies";

export async function GET() {
    try {
        removeAuthCookie();
        return NextResponse.json({ message: "Logout successful" }, { status: 200 });
    } catch (error) {   
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout error" }, { status: 500 });
    }
}