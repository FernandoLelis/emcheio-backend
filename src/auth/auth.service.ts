import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { Role } from '../generated/prisma/enums.js'; 

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // ==========================================
  // REGISTER (Criar conta)
  // ==========================================
  async register(registerDto: RegisterDto) {
    // 1. Verificar se e-mail já existe
    const existente = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existente) {
      throw new ConflictException('Já existe um usuário com este e-mail');
    }

    // 2. Criptografar a senha (bcrypt com salt de 10)
    const senhaHash = await bcrypt.hash(registerDto.senha, 10);

    // 3. Criar o usuário (por padrão, role = USER)
    const user = await this.prisma.user.create({
      data: {
        nome: registerDto.nome,
        email: registerDto.email,
        senha: senhaHash,
        role: Role.USER,
      },
    });

    this.logger.log(`✅ Usuário cadastrado: ${user.email} (ID: ${user.id})`);

    // Remove a senha do retorno
    const { senha, ...userSemSenha } = user;
    return userSemSenha;
  }

  // ==========================================
  // LOGIN (Autenticar)
  // ==========================================
  async login(loginDto: LoginDto) {
    // 1. Buscar o usuário pelo e-mail
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    // Se não existir, retorna o mesmo erro (por segurança não dizemos se é e-mail ou senha errada)
    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // 2. Comparar a senha fornecida com a senha criptografada no banco
    const senhaValida = await bcrypt.compare(loginDto.senha, user.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('E-mail ou senha incorretos');
    }

    // 3. Gerar o token JWT
    // O payload é o que vai dentro do token (não coloque dados sensíveis aqui)
    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    this.logger.log(`✅ Login realizado: ${user.email}`);

    // Remove a senha do retorno
    const { senha, ...userSemSenha } = user;

    return {
      access_token: token,
      user: userSemSenha,
    };
  }

  // ==========================================
  // ME (Retorna os dados do usuário logado)
  // ==========================================
  async me(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const { senha, ...userSemSenha } = user;
    return userSemSenha;
  }
}