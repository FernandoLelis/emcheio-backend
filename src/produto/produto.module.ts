import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service.js';
import { ProdutoController } from './produto.controller.js';
import { AuthModule } from '../auth/auth.module.js'; // ✅ Importando o AuthModule

@Module({
  imports: [AuthModule], // ✅ Adicionando aos imports do módulo
  controllers: [ProdutoController],
  providers: [ProdutoService],
})
export class ProdutoModule {}