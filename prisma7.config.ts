import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    // O Render injeta as variáveis de ambiente diretamente no processo.
    // Não precisamos do dotenv em produção.
    url: process.env["DIRECT_URL"],
  },
});