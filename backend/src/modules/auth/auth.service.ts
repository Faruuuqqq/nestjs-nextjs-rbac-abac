// src/modules/auth/auth.service.ts
import { Injectable, ConflictException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /**
   * Logika untuk mendaftarkan pengguna baru.
   */
  async register(createUserDto: CreateUserDto) {
    // 1. Cek apakah email sudah terdaftar
    const existingUser = await this.usersService.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Email sudah terdaftar');
    }

    // 2. Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. Ambil peran 'USER' dari database (diasumsikan sudah di-seed)
    const userRole = await this.prisma.role.findUnique({ where: { name: 'USER' } });
    if (!userRole) {
      throw new InternalServerErrorException("Peran 'USER' tidak ditemukan.");
    }

    // 4. Buat pengguna baru
    const user = await this.usersService.create({
      email: createUserDto.email,
      password: hashedPassword,
      name: createUserDto.name,
      roles: {
        connect: [{ id: userRole.id }],
      },
    });

    // 5. Kembalikan data user tanpa password
    const { password, ...result } = user;
    return result;
  }

  /**
   * Memvalidasi kredensial pengguna (email dan password).
   * Ini akan digunakan oleh sistem login (Passport.js).
   */
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // Cek apakah user ada DAN password cocok
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Logika untuk login dan membuat JWT.
   */
  async login(user: any) {
    // Dapatkan nama peran dari objek user
    const roles = user.roles.map((role) => role.name);

    // Buat payload untuk JWT
    const payload = {
      email: user.email,
      sub: user.id, // 'sub' adalah singkatan dari 'subject', standar untuk ID pengguna
      roles: roles,
    };

    // Buat token menggunakan payload
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}