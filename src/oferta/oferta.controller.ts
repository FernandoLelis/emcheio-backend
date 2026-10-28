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
import { OfertaService } from './oferta.service.js';
import { CreateOfertaDto } from './dto/create-oferta.dto.js';
import { UpdateOfertaDto } from './dto/update-oferta.dto.js';

// ✅ Imports de Autenticação
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { Role } from '../generated/prisma/enums.js';

@Controller('ofertas')
export class OfertaController {
  constructor(private readonly ofertaService: OfertaService) {}

  // ==========================================
  // POST /api/ofertas (Protegido)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createOfertaDto: CreateOfertaDto) {
    return this.ofertaService.create(createOfertaDto);
  }

  // ==========================================
  // GET /api/ofertas (Público)
  // ==========================================
  @Get()
  findAll() {
    return this.ofertaService.findAll();
  }

  // ==========================================
  // GET /api/ofertas/produto/:produtoId (Público)
  // ==========================================
  @Get('produto/:produtoId')
  findByProduto(@Param('produtoId', ParseIntPipe) produtoId: number) {
    return this.ofertaService.findByProduto(produtoId);
  }

  // ==========================================
  // GET /api/ofertas/:id (Público)
  // ==========================================
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaService.findOne(id);
  }

  // ==========================================
  // PUT /api/ofertas/:id (Protegido)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfertaDto: UpdateOfertaDto,
  ) {
    return this.ofertaService.update(id, updateOfertaDto);
  }

  // ==========================================
  // DELETE /api/ofertas/:id (Protegido)
  // ==========================================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ofertaService.remove(id);
  }
}