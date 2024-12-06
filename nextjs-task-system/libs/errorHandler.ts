import { NextResponse } from "next/server";

export const errorHandler = (statusCode: number, message: string) => {
    return NextResponse.json(
        { error: message },
        { status: statusCode }
    );
};