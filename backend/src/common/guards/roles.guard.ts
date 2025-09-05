// src/common/guards/roles.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Dapatkan peran yang dibutuhkan dari metadata yang ditempelkan oleh @Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(), // Cek metadata di level fungsi (endpoint)
      context.getClass(),   // Cek metadata di level class (controller)
    ]);

    // Jika tidak ada @Roles decorator, endpoint ini tidak dijaga oleh RolesGuard, jadi izinkan akses.
    if (!requiredRoles) {
      return true;
    }

    // 2. Dapatkan data pengguna dari request (yang sudah ditambahkan oleh JwtAuthGuard)
    const { user } = context.switchToHttp().getRequest();

    // 3. Bandingkan peran yang dimiliki pengguna dengan peran yang dibutuhkan
    // Fungsi ini akan mengembalikan 'true' jika setidaknya ada satu peran yang cocok.
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}