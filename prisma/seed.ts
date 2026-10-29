import "dotenv/config";
import { PrismaClient } from '../src/generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

// 1. Pega a URL direta do .env
const connectionString = process.env.DIRECT_URL;
if (!connectionString) {
  throw new Error("DIRECT_URL não encontrada no .env");
}

// 2. Cria o Adapter do PostgreSQL
const adapter = new PrismaPg({ connectionString });

// 3. Passa o adapter para o PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed no banco novo...');

  // Cria o usuário Admin
  const senhaHash = await bcrypt.hash('senha123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@emcheio.com.br' },
    update: {},
    create: {
      nome: 'Fernando Admin',
      email: 'admin@emcheio.com.br',
      senha: senhaHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Usuário Admin criado/verificado: ${admin.email}`);
  console.log('🌱 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });