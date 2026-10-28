import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProdutoDto } from './dto/create-produto.dto.js';
import { UpdateProdutoDto } from './dto/update-produto.dto.js';

@Injectable()
export class ProdutoService {
  private readonly logger = new Logger(ProdutoService.name);

  constructor(private readonly prisma: PrismaService) {}

  private async validarCategoria(categoriaId?: number) {
    if (!categoriaId) return;
    const categoria = await this.prisma.categoria.findUnique({
      where: { id: categoriaId },
    });
    if (!categoria) {
      throw new BadRequestException(`Categoria com ID ${categoriaId} não existe`);
    }
  }

  async create(createProdutoDto: CreateProdutoDto) {
    const existente = await this.prisma.produto.findUnique({
      where: { slug: createProdutoDto.slug },
    });

    if (existente) {
      throw new ConflictException(`Já existe um produto com o slug "${createProdutoDto.slug}"`);
    }

    await this.validarCategoria(createProdutoDto.categoriaId);

    const produto = await this.prisma.produto.create({
      data: createProdutoDto,
      include: { categoria: true, ofertas: true },
    });

    this.logger.log(`✅ Produto criado: ${produto.nome} (ID: ${produto.id})`);
    return produto;
  }

  async findAll() {
    return this.prisma.produto.findMany({
      include: { categoria: true, ofertas: true },
      orderBy: { nome: 'asc' },
    });
  }

  // ✅ NOVO MÉTODO DE BUSCA
  async buscar(termo: string) {
    if (!termo || termo.trim() === '') {
      return [];
    }

    this.logger.log(`🔍 Buscando produtos por: "${termo}"`);

    return this.prisma.produto.findMany({
      where: {
        OR: [
          { nome: { contains: termo, mode: 'insensitive' } },
          { marca: { contains: termo, mode: 'insensitive' } },
          { descricao: { contains: termo, mode: 'insensitive' } },
          { categoria: { nome: { contains: termo, mode: 'insensitive' } } },
        ],
      },
      include: { categoria: true, ofertas: true },
      orderBy: { nome: 'asc' },
      take: 50, // Limite de segurança para não sobrecarregar
    });
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { categoria: true, ofertas: true },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async findBySlug(slug: string) {
    const produto = await this.prisma.produto.findUnique({
      where: { slug },
      include: { categoria: true, ofertas: true },
    });

    if (!produto) {
      throw new NotFoundException(`Produto "${slug}" não encontrado`);
    }

    return produto;
  }

  async update(id: number, updateProdutoDto: UpdateProdutoDto) {
    await this.findOne(id);

    if (updateProdutoDto.slug) {
      const comMesmoSlug = await this.prisma.produto.findUnique({
        where: { slug: updateProdutoDto.slug },
      });
      if (comMesmoSlug && comMesmoSlug.id !== id) {
        throw new ConflictException(`Já existe outro produto com o slug "${updateProdutoDto.slug}"`);
      }
    }

    await this.validarCategoria(updateProdutoDto.categoriaId);

    const produto = await this.prisma.produto.update({
      where: { id },
      data: updateProdutoDto,
      include: { categoria: true, ofertas: true },
    });

    this.logger.log(`✏️ Produto atualizado: ${produto.nome} (ID: ${produto.id})`);
    return produto;
  }

  async remove(id: number) {
    await this.findOne(id);
    const produto = await this.prisma.produto.delete({ where: { id } });
    this.logger.log(`🗑️ Produto removido: ${produto.nome} (ID: ${produto.id})`);
    return { message: `Produto "${produto.nome}" removido com sucesso` };
  }
}