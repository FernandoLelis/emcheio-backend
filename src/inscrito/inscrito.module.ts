import { Module } from '@nestjs/common';
import { InscritoService } from './inscrito.service.js';
import { InscritoController } from './inscrito.controller.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [InscritoController],
  providers: [InscritoService],
})
export class InscritoModule {}