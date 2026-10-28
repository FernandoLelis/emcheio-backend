import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCupomDto } from './dto/create-cupom.dto.js';
import { UpdateCupomDto } from './dto/update-cupom.dto.js';

@Injectable()
export class CupomService {
  private readonly logger = new Logger(CupomService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // CREATE
  // ==========================================
  async create(createCupomDto: CreateCupomDto) {
    // Verificar se já existe cupom com o mesmo código + loja
    const existente = await this.prisma.cupom.findFirst({
      where: {
        codigo: createCupomDto.codigo,
        loja: createCupomDto.loja,
      },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe um cupom "${createCupomDto.codigo}" para a loja "${createCupomDto.loja}"`,
      );
    }

    const cupom = await this.prisma.cupom.create({
      data: {
        ...createCupomDto,
        validadeInicio: createCupomDto.validadeInicio
          ? new Date(createCupomDto.validadeInicio)
          : null,
        validadeFim: createCupomDto.validadeFim
          ? new Date(createCupomDto.validadeFim)
          : null,
      },
    });

    this.logger.log(
      `✅ Cupom criado: ${cupom.codigo} (${cupom.loja}) - ID: ${cupom.id}`,
    );
    return cupom;
  }

  // ==========================================
  // READ ALL
  // ==========================================
  async findAll() {
    return this.prisma.cupom.findMany({
      orderBy: { criadoEm: 'desc' },
    });
  }

  // ==========================================
  // READ VALIDOS — apenas cupons dentro da validade
  // ==========================================
  async findValidos() {
    const hoje = new Date();

    return this.prisma.cupom.findMany({
      where: {
        AND: [
          // validadeInicio é null OU <= hoje
          {
            OR: [{ validadeInicio: null }, { validadeInicio: { lte: hoje } }],
          },
          // validadeFim é null OU >= hoje
          {
            OR: [{ validadeFim: null }, { validadeFim: { gte: hoje } }],
          },
        ],
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  // ==========================================
  // READ ONE
  // ==========================================
  async findOne(id: number) {
    const cupom = await this.prisma.cupom.findUnique({
      where: { id },
    });

    if (!cupom) {
      throw new NotFoundException(`Cupom com ID ${id} não encontrado`);
    }

    return cupom;
  }

  // ==========================================
  // UPDATE
  // ==========================================
  async update(id: number, updateCupomDto: UpdateCupomDto) {
    await this.findOne(id);

    // Se está mudando código ou loja, verificar duplicata
    if (updateCupomDto.codigo || updateCupomDto.loja) {
      const cupomAtual = await this.findOne(id);

      const novaLoja = updateCupomDto.loja ?? cupomAtual.loja;
      const novoCodigo = updateCupomDto.codigo ?? cupomAtual.codigo;

      const comMesmoCodigo = await this.prisma.cupom.findFirst({
        where: {
          codigo: novoCodigo,
          loja: novaLoja,
          NOT: { id },
        },
      });

      if (comMesmoCodigo) {
        throw new ConflictException(
          `Já existe outro cupom "${novoCodigo}" para a loja "${novaLoja}"`,
        );
      }
    }

    const cupom = await this.prisma.cupom.update({
      where: { id },
      data: {
        ...updateCupomDto,
        validadeInicio: updateCupomDto.validadeInicio
          ? new Date(updateCupomDto.validadeInicio)
          : undefined,
        validadeFim: updateCupomDto.validadeFim
          ? new Date(updateCupomDto.validadeFim)
          : undefined,
      },
    });

    this.logger.log(`✏️ Cupom atualizado: ${cupom.codigo} (ID: ${cupom.id})`);
    return cupom;
  }

  // ==========================================
  // DELETE
  // ==========================================
  async remove(id: number) {
    await this.findOne(id);

    const cupom = await this.prisma.cupom.delete({
      where: { id },
    });

    this.logger.log(`🗑️ Cupom removido: ${cupom.codigo} (ID: ${cupom.id})`);
    return { message: `Cupom "${cupom.codigo}" removido com sucesso` };
  }
}