import { handlers } from "@/utils/auth"
import { prisma } from "@/utils/prisma"
import bcrypt from "bcrypt";

export const { GET, POST } = handlers