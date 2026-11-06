import { Controller, Get, UseGuards } from '@nestjs/common';
import { RecomendoService } from './recomendo.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('recomendo')
export class RecomendoController {
  constructor(private readonly recomendoService: RecomendoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('sincronizar')
  sincronizar() {
    return this.recomendoService.sincronizar();
  }
}