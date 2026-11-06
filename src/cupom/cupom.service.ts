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

  // ✅ MÉTODO MÁGICO: Extrai o número e o tipo de desconto do texto
  private extrairDadosDesconto(texto: string | undefined | null) {
    if (!texto) return { valorDesconto: null, tipoDesconto: null };

    // Procura por números na string (aceita vírgula ou ponto)
    const match = texto.match(/[\d.,]+/);
    let valor = null;
    let tipo = 'fixo';

    if (match) {
      // Troca vírgula por ponto para o Float do banco aceitar (ex: "50,00" vira 50.00)
      const valorLimpo = match[0].replace(',', '.');
      valor = parseFloat(valorLimpo);
    }

    // Se o texto original tiver "%", o tipo é porcentagem
    if (texto.includes('%')) {
      tipo = 'porcentagem';
    }

    return { valorDesconto: valor, tipoDesconto: tipo };
  }

  async create(createCupomDto: CreateCupomDto) {
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

    // ✅ Extrai os dados antes de salvar
    const { valorDesconto, tipoDesconto } = this.extrairDadosDesconto(createCupomDto.descontoTexto);

    const cupom = await this.prisma.cupom.create({
      data: {
        ...createCupomDto,
        validadeInicio: createCupomDto.validadeInicio
          ? new Date(createCupomDto.validadeInicio)
          : null,
        validadeFim: createCupomDto.validadeFim
          ? new Date(createCupomDto.validadeFim)
          : null,
        valorDesconto,
        tipoDesconto,
        origem: 'manual', // Cupons criados pelo admin são sempre manuais
      },
    });

    this.logger.log(
      `✅ Cupom criado: ${cupom.codigo} (${cupom.loja}) - Desconto Extraído: ${cupom.valorDesconto} ${cupom.tipoDesconto}`,
    );
    return cupom;
  }

  async findAll() {
    return this.prisma.cupom.findMany({
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
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findOne(id: number) {
    const cupom = await this.prisma.cupom.findUnique({
      where: { id },
    });

    if (!cupom) {
      throw new NotFoundException(`Cupom com ID ${id} não encontrado`);
    }

    return cupom;
  }

  async update(id: number, updateCupomDto: UpdateCupomDto) {
    await this.findOne(id);

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

    // ✅ Se o descontoTexto foi alterado, recalcula os valores
    let dadosDesconto = {};
    if (updateCupomDto.descontoTexto) {
      dadosDesconto = this.extrairDadosDesconto(updateCupomDto.descontoTexto);
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
        ...dadosDesconto, // Aplica o valor e o tipo recalculados
      },
    });

    this.logger.log(`✏️ Cupom atualizado: ${cupom.codigo} (ID: ${cupom.id})`);
    return cupom;
  }

  async remove(id: number) {
    await this.findOne(id);

    const cupom = await this.prisma.cupom.delete({
      where: { id },
    });

    this.logger.log(`🗑️ Cupom removido: ${cupom.codigo} (ID: ${cupom.id})`);
    return { message: `Cupom "${cupom.codigo}" removido com sucesso` };
  }
}