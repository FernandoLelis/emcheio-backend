import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // O comando abaixo usa o 'tsx' para rodar o arquivo TypeScript do seed
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // O Prisma CLI vai usar a URL direta (sem pgbouncer) para rodar as migrations
    url: process.env["DIRECT_URL"],
  },
});