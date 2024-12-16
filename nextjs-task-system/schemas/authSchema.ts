// schemas/authSchema.ts
import { z } from "zod";

export const authenticateUserSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }).trim(),
  password: z.string().min(1, { message: "Password is required" }).trim(),
});

export type AuthenticateUserSchema = z.infer<typeof authenticateUserSchema>;
