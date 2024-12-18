import { NextResponse } from "next/server";
import { z } from "zod";
import { queryErrors } from "@/db/queries";
class ApiErrors {
  queryError(error: Error, model: string = "Resource") {
    if (error.message === queryErrors.notFound)
      return this.miscError("Not Found", `${model} not found.`, 404);
    if (error.message === queryErrors.admin) return this.badRequest();
    if (error.message === queryErrors.duplicate)
      return this.miscError(
        "Duplication Error",
        `${model} already exists`,
        400,
      );
    // default error
    return this.server();
  }
  zodError(error: z.ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return NextResponse.json({ error: formattedErrors }, { status: 400 });
  }
  badRequest(details?: string) {
    return NextResponse.json(
      {
        error: "Bad request",
        message: details || "There has been an error with the request",
      },
      {
        status: 400,
      },
    );
  }
  unauthorized() {
    return NextResponse.json(
      {
        error: "Authentication required",
        message: "You must be logged in to access this resource",
      },
      { status: 401 },
    );
  }
  miscError(error: string, message: string, status: number) {
    return NextResponse.json(
      {
        error,
        message,
      },
      {
        status,
      },
    );
  }
  server() {
    return NextResponse.json(
      {
        error: "Server Error",
        message: "There has been an error, try again later",
      },
      { status: 500 },
    );
  }
}

const apiErrorHandler = new ApiErrors();
export { apiErrorHandler as ApiError };
