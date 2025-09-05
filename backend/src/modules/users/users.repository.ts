// src/modules/users/users.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UsersRepository {
  // Kita inject PrismaService agar bisa berinteraksi dengan database
  constructor(private prisma: PrismaService) {}

  /**
   * Membuat user baru di database.
   * @param data - Data user yang akan dibuat
   * @returns User yang baru dibuat
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  /**
   * Mencari satu user berdasarkan alamat email.
   * Kita juga menyertakan (include) data perannya (roles).
   * @param email - Alamat email user yang dicari
   * @returns User beserta perannya, atau null jika tidak ditemukan
   */
  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { roles: true },
    });
  }
}