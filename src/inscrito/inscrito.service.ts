import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateInscritoDto } from './dto/create-inscrito.dto.js';

@Injectable()
export class InscritoService {
  private readonly logger = new Logger(InscritoService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ==========================================
  // NORMALIZA WHATSAPP
  // Remove tudo que não é dígito, exceto o "+" inicial
  // ==========================================
  private normalizarWhatsapp(whatsapp?: string): string | null {
    if (!whatsapp) return null;

    // Remove tudo que não for dígito (parênteses, traços, espaços)
    let limpo = whatsapp.replace(/\D/g, '');

    // Se tem DDI 55 no início, remove (vamos armazenar sem DDI)
    if (limpo.startsWith('55') && limpo.length > 11) {
      limpo = limpo.substring(2);
    }

    // Valida tamanho final (DDD + 8 ou 9 dígitos)
    if (limpo.length < 10 || limpo.length > 11) {
      throw new ConflictException('Número de WhatsApp inválido');
    }

    return limpo;
  }

  // ==========================================
  // CREATE (público)
  // ==========================================
  async create(createInscritoDto: CreateInscritoDto) {
    // 1. Normalizar WhatsApp antes de salvar
    const whatsappNormalizado = this.normalizarWhatsapp(
      createInscritoDto.whatsapp,
    );

    // 2. Verificar duplicata por email
    const existente = await this.prisma.inscrito.findUnique({
      where: { email: createInscritoDto.email },
    });

    if (existente) {
      throw new ConflictException(
        `O e-mail "${createInscritoDto.email}" já está inscrito`,
      );
    }

    // 3. Criar inscrito
    const inscrito = await this.prisma.inscrito.create({
      data: {
        ...createInscritoDto,
        whatsapp: whatsappNormalizado,
      },
    });

    this.logger.log(
      `✅ Inscrito criado: ${inscrito.email} (ID: ${inscrito.id})`,
    );
    return inscrito;
  }

  // ==========================================
  // READ ALL (admin)
  // ==========================================
  async findAll() {
    return this.prisma.inscrito.findMany({
      orderBy: { criadoEm: 'desc' },
    });
  }

  // ==========================================
  // READ ONE (admin)
  // ==========================================
  async findOne(id: number) {
    const inscrito = await this.prisma.inscrito.findUnique({
      where: { id },
    });

    if (!inscrito) {
      throw new NotFoundException(`Inscrito com ID ${id} não encontrado`);
    }

    return inscrito;
  }

  // ==========================================
  // DELETE (admin)
  // ==========================================
  async remove(id: number) {
    await this.findOne(id);

    const inscrito = await this.prisma.inscrito.delete({
      where: { id },
    });

    this.logger.log(
      `🗑️ Inscrito removido: ${inscrito.email} (ID: ${inscrito.id})`,
    );
    return { message: `Inscrito "${inscrito.email}" removido com sucesso` };
  }
}