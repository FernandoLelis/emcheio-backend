import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { InscritoService } from './inscrito.service.js';
import { CreateInscritoDto } from './dto/create-inscrito.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('inscritos')
export class InscritoController {
  constructor(private readonly inscritoService: InscritoService) {}

  // POST /api/inscritos (Público)
  @Post()
  create(@Body() createInscritoDto: CreateInscritoDto) {
    return this.inscritoService.create(createInscritoDto);
  }

  // GET /api/inscritos (Protegido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  findAll() {
    return this.inscritoService.findAll();
  }

  // GET /api/inscritos/:id (Protegido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inscritoService.findOne(id);
  }

  // DELETE /api/inscritos/:id (Protegido)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inscritoService.remove(id);
  }
}