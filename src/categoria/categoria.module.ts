import { Module } from '@nestjs/common';
import { CategoriaService } from './categoria.service.js';
import { CategoriaController } from './categoria.controller.js';
import { AuthModule } from '../auth/auth.module.js'; // ✅ Importando

@Module({
  imports: [AuthModule], // ✅ Adicionando
  controllers: [CategoriaController],
  providers: [CategoriaService],
})
export class CategoriaModule {}