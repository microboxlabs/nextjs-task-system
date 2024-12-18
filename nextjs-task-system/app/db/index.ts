import { config } from "@/lib/utils";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

export const db = drizzle(config.dbUrl, { schema });
