import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCupomDto } from './dto/create-cupom.dto.js';
import { UpdateCupomDto } from './dto/update-cupom.dto.js';

@Injectable()
export class CupomService {
  private readonly logger = new Logger(CupomService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCupomDto: CreateCupomDto) {
    const existente = await this.prisma.cupom.findFirst({
      where: { codigo: createCupomDto.codigo, loja: createCupomDto.loja },
    });
    if (existente) throw new ConflictException(`Já existe um cupom "${createCupomDto.codigo}" para a loja "${createCupomDto.loja}"`);

    const { categoriaIds, ...dados } = createCupomDto;

    const cupom = await this.prisma.cupom.create({
      data: {
        ...dados,
        validadeInicio: dados.validadeInicio ? new Date(dados.validadeInicio) : null,
        validadeFim: dados.validadeFim ? new Date(dados.validadeFim) : null,
        categorias: {
          connect: categoriaIds?.map((id) => ({ id })) || [],
        },
      },
      include: { categorias: true },
    });

    this.logger.log(`✅ Cupom criado: ${cupom.codigo} (${cupom.loja}) - ID: ${cupom.id}`);
    return cupom;
  }

  async findAll() {
    return this.prisma.cupom.findMany({
      include: { categorias: true },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findValidos() {
    const hoje = new Date();
    return this.prisma.cupom.findMany({
      where: {
        AND: [
          { OR: [{ validadeInicio: null }, { validadeInicio: { lte: hoje } }] },
          { OR: [{ validadeFim: null }, { validadeFim: { gte: hoje } }] },
        ],
      },
      include: { categorias: true },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findOne(id: number) {
    const cupom = await this.prisma.cupom.findUnique({
      where: { id },
      include: { categorias: true },
    });
    if (!cupom) throw new NotFoundException(`Cupom com ID ${id} não encontrado`);
    return cupom;
  }

  async update(id: number, updateCupomDto: UpdateCupomDto) {
    await this.findOne(id);
    const { categoriaIds, ...dados } = updateCupomDto;

    const cupom = await this.prisma.cupom.update({
      where: { id },
      data: {
        ...dados,
        validadeInicio: dados.validadeInicio ? new Date(dados.validadeInicio) : undefined,
        validadeFim: dados.validadeFim ? new Date(dados.validadeFim) : undefined,
        categorias: {
          set: categoriaIds?.map((id) => ({ id })) || [],
        },
      },
      include: { categorias: true },
    });
    this.logger.log(`✏️ Cupom atualizado: ${cupom.codigo} (ID: ${cupom.id})`);
    return cupom;
  }

  async remove(id: number) {
    await this.findOne(id);
    const cupom = await this.prisma.cupom.delete({ where: { id } });
    this.logger.log(`🗑️ Cupom removido: ${cupom.codigo} (ID: ${cupom.id})`);
    return { message: `Cupom "${cupom.codigo}" removido com sucesso` };
  }
}