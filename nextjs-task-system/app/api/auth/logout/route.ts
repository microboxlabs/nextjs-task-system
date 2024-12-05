import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 },
  );

  // Eliminar todas las cookies relacionadas con la autenticación
  response.cookies.delete("authToken");
  response.cookies.delete("userRole");

  return response;
}
