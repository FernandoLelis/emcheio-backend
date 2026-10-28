import { Module } from '@nestjs/common';
import { CupomService } from './cupom.service.js';
import { CupomController } from './cupom.controller.js';
import { AuthModule } from '../auth/auth.module.js'; // ✅ Importando

@Module({
  imports: [AuthModule], // ✅ Adicionando
  controllers: [CupomController],
  providers: [CupomService],
})
export class CupomModule {}