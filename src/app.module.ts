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
import { RecomendoModule } from './recomendo/recomendo.module.js'; // ✅ Importação

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CategoriaModule,
    ProdutoModule,
    OfertaModule,
    CupomModule,
    InscritoModule,
    AuthModule,
    RecomendoModule, // ✅ Adicionado
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}