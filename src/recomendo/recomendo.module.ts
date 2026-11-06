import { Module } from '@nestjs/common';
import { RecomendoService } from './recomendo.service.js';
import { RecomendoController } from './recomendo.controller.js';
import { CupomModule } from '../cupom/cupom.module.js';
import { AuthModule } from '../auth/auth.module.js'; // ✅ Importação necessária

@Module({
  imports: [CupomModule, AuthModule], // ✅ Adicionado o AuthModule aqui
  controllers: [RecomendoController],
  providers: [RecomendoService],
})
export class RecomendoModule {}