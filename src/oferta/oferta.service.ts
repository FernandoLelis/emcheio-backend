import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateOfertaDto } from './dto/create-oferta.dto.js';
import { UpdateOfertaDto } from './dto/update-oferta.dto.js';

@Injectable()
export class OfertaService {
  private readonly logger = new Logger(OfertaService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // CONVERSOR: Decimal → number
  // ==========================================
  private converterDecimais(oferta: any) {
    return {
      ...oferta,
      precoAtual: Number(oferta.precoAtual),
      precoOriginal:
        oferta.precoOriginal !== null ? Number(oferta.precoOriginal) : null,
    };
  }

  // ==========================================
  // VALIDAÇÃO: Produto existe?
  // ==========================================
  private async validarProduto(produtoId: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produto) {
      throw new BadRequestException(`Produto com ID ${produtoId} não existe`);
    }
  }

  // ==========================================
  // CREATE
  // ==========================================
  async create(createOfertaDto: CreateOfertaDto) {
    await this.validarProduto(createOfertaDto.produtoId);

    const oferta = await this.prisma.oferta.create({
      data: createOfertaDto,
      include: { produto: true },
    });

    this.logger.log(
      `✅ Oferta criada: ${oferta.loja} - Produto ${oferta.produtoId} (ID: ${oferta.id})`,
    );

    return this.converterDecimais(oferta);
  }

  // ==========================================
  // READ ALL
  // ==========================================
  async findAll() {
    const ofertas = await this.prisma.oferta.findMany({
      include: { produto: true },
      orderBy: { criadoEm: 'desc' },
    });

    return ofertas.map((oferta) => this.converterDecimais(oferta));
  }

  // ==========================================
  // READ ONE
  // ==========================================
  async findOne(id: number) {
    const oferta = await this.prisma.oferta.findUnique({
      where: { id },
      include: { produto: true },
    });

    if (!oferta) {
      throw new NotFoundException(`Oferta com ID ${id} não encontrada`);
    }

    return this.converterDecimais(oferta);
  }

  // ==========================================
  // READ BY PRODUTO
  // ==========================================
  async findByProduto(produtoId: number) {
    await this.validarProduto(produtoId);

    const ofertas = await this.prisma.oferta.findMany({
      where: { produtoId },
      orderBy: { precoAtual: 'asc' },
    });

    return ofertas.map((oferta) => this.converterDecimais(oferta));
  }

  // ==========================================
  // UPDATE
  // ==========================================
  async update(id: number, updateOfertaDto: UpdateOfertaDto) {
    await this.findOne(id);

    if (updateOfertaDto.produtoId) {
      await this.validarProduto(updateOfertaDto.produtoId);
    }

    const oferta = await this.prisma.oferta.update({
      where: { id },
      data: updateOfertaDto,
      include: { produto: true },
    });

    this.logger.log(`✏️ Oferta atualizada: ${oferta.loja} (ID: ${oferta.id})`);

    return this.converterDecimais(oferta);
  }

  // ==========================================
  // DELETE
  // ==========================================
  async remove(id: number) {
    await this.findOne(id);

    const oferta = await this.prisma.oferta.delete({
      where: { id },
    });

    this.logger.log(`🗑️ Oferta removida: ID ${oferta.id}`);
    return { message: `Oferta removida com sucesso` };
  }
}