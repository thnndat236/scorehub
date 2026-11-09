import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  datasource: {
    // Prisma CLI operations such as migrations should use Neon direct connection.
    url: env("DATABASE_URL_UNPOOLED")
  }
});
