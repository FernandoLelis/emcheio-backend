// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // A conexão para o CLI (migrações) deve ser a DIRETA.
  // Usamos a variável DIRECT_URL do .env.
  datasource: {
    url: process.env["DIRECT_URL"], 
  },
});