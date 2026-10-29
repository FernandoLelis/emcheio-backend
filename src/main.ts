import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Configuração de CORS: Permite o ambiente local e o site na Vercel
  app.enableCors({
    origin: [
      'http://localhost:3001',
      'https://emcheio.vercel.app'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // ✅ Importante para o Render: usa a porta da variável de ambiente ou 3000 como fallback
  const port = process.env.PORT || 3000;
  
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Backend rodando na porta ${port}`);
}

bootstrap();