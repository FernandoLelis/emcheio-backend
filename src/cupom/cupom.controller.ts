import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CupomService } from './cupom.service.js';
import { CreateCupomDto } from './dto/create-cupom.dto.js';
import { UpdateCupomDto } from './dto/update-cupom.dto.js';

// ✅ Imports de Autenticação
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('cupons')
export class CupomController {
  constructor(private readonly cupomService: CupomService) {}

  // ==========================================
  // POST /api/cupons (Protegido)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createCupomDto: CreateCupomDto) {
    return this.cupomService.create(createCupomDto);
  }

  // ==========================================
  // GET /api/cupons (Público)
  // ==========================================
  @Get()
  findAll() {
    return this.cupomService.findAll();
  }

  // ==========================================
  // GET /api/cupons/validos (Público)
  // ==========================================
  @Get('validos')
  findValidos() {
    return this.cupomService.findValidos();
  }

  // ==========================================
  // GET /api/cupons/:id (Público)
  // ==========================================
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cupomService.findOne(id);
  }

  // ==========================================
  // PUT /api/cupons/:id (Protegido)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCupomDto: UpdateCupomDto,
  ) {
    return this.cupomService.update(id, updateCupomDto);
  }

  // ==========================================
  // DELETE /api/cupons/:id (Protegido)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.cupomService.remove(id);
  }
}