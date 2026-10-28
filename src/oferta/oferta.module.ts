import { Module } from '@nestjs/common';
import { OfertaService } from './oferta.service.js';
import { OfertaController } from './oferta.controller.js';
import { AuthModule } from '../auth/auth.module.js'; // ✅ Importando

@Module({
  imports: [AuthModule], // ✅ Adicionando
  controllers: [OfertaController],
  providers: [OfertaService],
})
export class OfertaModule {}