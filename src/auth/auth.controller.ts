import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ==========================================
  // POST /api/auth/register
  // ==========================================
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ==========================================
  // POST /api/auth/login
  // ==========================================
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ==========================================
  // GET /api/auth/me
  // Rota protegida: só acessa quem estiver logado
  // ==========================================
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    // O 'req.user' foi populado automaticamente pela JwtStrategy
    return this.authService.me(req.user.id);
  }
}