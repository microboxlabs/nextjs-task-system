import { defineConfig } from "drizzle-kit";
import { config } from "@/lib/utils";
const { DATABASE_URL, DATABASE_DIALECT } = process.env;
export default defineConfig({
  out: "./drizzle",
  schema: "./app/db/schema.ts",
  dialect: (DATABASE_DIALECT as "postgresql" | "mysql" | "sqlite")!,
  dbCredentials: {
    url: config.dbUrl!,
  },
});
