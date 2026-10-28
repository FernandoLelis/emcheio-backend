import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCategoriaDto } from './dto/create-categoria.dto.js';
import { UpdateCategoriaDto } from './dto/update-categoria.dto.js';

@Injectable()
export class CategoriaService {
  private readonly logger = new Logger(CategoriaService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // CREATE - Criar nova categoria
  // ==========================================
  async create(createCategoriaDto: CreateCategoriaDto) {
    const existente = await this.prisma.categoria.findUnique({
      where: { slug: createCategoriaDto.slug },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe uma categoria com o slug "${createCategoriaDto.slug}"`,
      );
    }

    const categoria = await this.prisma.categoria.create({
      data: createCategoriaDto,
    });

    this.logger.log(`✅ Categoria criada: ${categoria.nome} (ID: ${categoria.id})`);
    return categoria;
  }

  // ==========================================
  // READ ALL - Listar todas as categorias
  // ==========================================
    async findAll() {
      return this.prisma.categoria.findMany({
        include: {
          _count: {
            select: { produtos: true },
          },
        },
        orderBy: { nome: 'asc' },
      });
    }

  // ==========================================
  // READ ONE - Buscar categoria por ID
  // ==========================================
  async findOne(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { id },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
    }

    return categoria;
  }

  // ==========================================
  // READ ONE BY SLUG - Buscar categoria por slug
  // ==========================================
  async findBySlug(slug: string) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { slug },
      include: { produtos: true },
    });

    if (!categoria) {
      throw new NotFoundException(`Categoria "${slug}" não encontrada`);
    }

    return categoria;
  }

  // ==========================================
  // UPDATE - Atualizar categoria
  // ==========================================
  async update(id: number, updateCategoriaDto: UpdateCategoriaDto) {
    await this.findOne(id);

    if (updateCategoriaDto.slug) {
      const comMesmoSlug = await this.prisma.categoria.findUnique({
        where: { slug: updateCategoriaDto.slug },
      });

      if (comMesmoSlug && comMesmoSlug.id !== id) {
        throw new ConflictException(
          `Já existe outra categoria com o slug "${updateCategoriaDto.slug}"`,
        );
      }
    }

    const categoria = await this.prisma.categoria.update({
      where: { id },
      data: updateCategoriaDto,
    });

    this.logger.log(`✏️ Categoria atualizada: ${categoria.nome} (ID: ${categoria.id})`);
    return categoria;
  }

  // ==========================================
  // DELETE - Remover categoria
  // ==========================================
  async remove(id: number) {
    await this.findOne(id);

    const categoria = await this.prisma.categoria.delete({
      where: { id },
    });

    this.logger.log(`🗑️ Categoria removida: ${categoria.nome} (ID: ${categoria.id})`);
    return { message: `Categoria "${categoria.nome}" removida com sucesso` };
  }
}