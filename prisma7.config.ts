import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Carrega as variáveis de ambiente de forma explícita
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: process.env["DIRECT_URL"],
  },
});