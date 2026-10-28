import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator.js';
import { Role } from '../../generated/prisma/enums.js';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Pega as roles exigidas na rota (ex: @Roles(Role.ADMIN))
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Se a rota não exige nenhuma role específica, libera o acesso
    if (!requiredRoles) {
      return true;
    }

    // 3. Pega o usuário que foi anexado na request pela JwtStrategy
    const { user } = context.switchToHttp().getRequest();

    // 4. Verifica se o usuário tem a permissão exigida
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Acesso negado. Permissão insuficiente.');
    }

    return true;
  }
}