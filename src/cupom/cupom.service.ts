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

  private extrairDadosDesconto(texto: string | undefined | null) {
    if (!texto) return { valorDesconto: null, tipoDesconto: null };

    const match = texto.match(/[\d.,]+/);
    let valor = null;
    let tipo = 'fixo';

    if (match) {
      const valorLimpo = match[0].replace(',', '.');
      valor = parseFloat(valorLimpo);
    }

    if (texto.includes('%')) {
      tipo = 'porcentagem';
    }

    return { valorDesconto: valor, tipoDesconto: tipo };
  }

  async create(createCupomDto: CreateCupomDto) {
    const existente = await this.prisma.cupom.findFirst({
      where: { codigo: createCupomDto.codigo, loja: createCupomDto.loja },
    });

    if (existente) {
      throw new ConflictException(
        `Já existe um cupom "${createCupomDto.codigo}" para a loja "${createCupomDto.loja}"`,
      );
    }

    // ✅ DESESTRUTURANDO O categoriaIds AQUI
    const { categoriaIds, ...dadosCupom } = createCupomDto;
    const { valorDesconto, tipoDesconto } = this.extrairDadosDesconto(dadosCupom.descontoTexto);

    const cupom = await this.prisma.cupom.create({
      data: {
        ...dadosCupom,
        validadeInicio: dadosCupom.validadeInicio ? new Date(dadosCupom.validadeInicio) : null,
        validadeFim: dadosCupom.validadeFim ? new Date(dadosCupom.validadeFim) : null,
        valorDesconto,
        tipoDesconto,
        origem: 'manual',
        // ✅ CONECTANDO AS CATEGORIAS DA FORMA CORRETA
        categorias: {
          connect: categoriaIds?.map((id) => ({ id })) || [],
        },
      },
      include: { categorias: true },
    });

    this.logger.log(`✅ Cupom criado: ${cupom.codigo} (${cupom.loja})`);
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

    if (updateCupomDto.codigo || updateCupomDto.loja) {
      const cupomAtual = await this.findOne(id);
      const novaLoja = updateCupomDto.loja ?? cupomAtual.loja;
      const novoCodigo = updateCupomDto.codigo ?? cupomAtual.codigo;

      const comMesmoCodigo = await this.prisma.cupom.findFirst({
        where: { codigo: novoCodigo, loja: novaLoja, NOT: { id } },
      });

      if (comMesmoCodigo) {
        throw new ConflictException(`Já existe outro cupom "${novoCodigo}" para a loja "${novaLoja}"`);
      }
    }

    // ✅ DESESTRUTURANDO TAMBÉM NO UPDATE
    const { categoriaIds, ...dadosCupom } = updateCupomDto;

    let dadosDesconto = {};
    if (dadosCupom.descontoTexto) {
      dadosDesconto = this.extrairDadosDesconto(dadosCupom.descontoTexto);
    }

    const cupom = await this.prisma.cupom.update({
      where: { id },
      data: {
        ...dadosCupom,
        validadeInicio: dadosCupom.validadeInicio ? new Date(dadosCupom.validadeInicio) : undefined,
        validadeFim: dadosCupom.validadeFim ? new Date(dadosCupom.validadeFim) : undefined,
        ...dadosDesconto,
        // ✅ SE ENVIOU CATEGORIAS NOVAS, O 'set' SUBSTITUI AS ANTIGAS
        categorias: categoriaIds ? {
          set: categoriaIds.map((catId) => ({ id: catId })),
        } : undefined,
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

  // Método do Recomendo mantido...
  async salvarCupomRecomendo(dados: {
    loja: string;
    codigo: string;
    descontoTexto: string;
    condicoes: string;
    urlAfiliado: string;
    validadeFim: Date | null;
  }) {
    const existente = await this.prisma.cupom.findFirst({
      where: { codigo: dados.codigo, loja: dados.loja },
    });

    if (existente && existente.origem === 'manual') {
      return 'ignorado';
    }

    const { valorDesconto, tipoDesconto } = this.extrairDadosDesconto(dados.descontoTexto);

    if (existente) {
      await this.prisma.cupom.update({
        where: { id: existente.id },
        data: {
          ...dados,
          valorDesconto,
          tipoDesconto,
        },
      });
      return 'atualizado';
    } else {
      await this.prisma.cupom.create({
        data: {
          ...dados,
          valorDesconto,
          tipoDesconto,
          origem: 'recomendo',
        },
      });
      return 'criado';
    }
  }
}