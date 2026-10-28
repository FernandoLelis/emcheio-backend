import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { CategoriaModule } from './categoria/categoria.module.js';
import { ProdutoModule } from './produto/produto.module.js';
import { OfertaModule } from './oferta/oferta.module.js';
import { CupomModule } from './cupom/cupom.module.js';
import { InscritoModule } from './inscrito/inscrito.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,       // Disponível em toda a aplicação
      envFilePath: '.env',  // Caminho do arquivo
    }),
    PrismaModule,
    CategoriaModule,
    ProdutoModule,
    OfertaModule,
    CupomModule,
    InscritoModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}