import { Module } from '@nestjs/common';
import { CupomService } from './cupom.service.js';
import { CupomController } from './cupom.controller.js';
import { AuthModule } from '../auth/auth.module.js'; // ✅ Importação necessária

@Module({
  imports: [AuthModule], // ✅ Adicionado aqui
  controllers: [CupomController],
  providers: [CupomService],
  exports: [CupomService],
})
export class CupomModule {}