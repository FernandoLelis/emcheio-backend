import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ CORS — permite requisições do frontend
  app.enableCors({
    origin: [
      'http://localhost:3001',      // Next.js em desenvolvimento
      'http://localhost:3000',      // Fallback
      // Em produção, adicionar:
      // 'https://emcheio.com.br',
      // 'https://www.emcheio.com.br',
    ],
    credentials: true,               // Permite envio de cookies/headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ✅ Validação global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Prefixo global para todas as rotas
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();