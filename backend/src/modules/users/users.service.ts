// src/modules/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  // Kita inject UsersRepository, bukan PrismaService
  constructor(private repository: UsersRepository) {}

  /**
   * Meneruskan permintaan untuk mencari user berdasarkan email ke repository.
   */
  async findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  /**
   * Meneruskan permintaan untuk membuat user baru ke repository.
   */
  async create(data: Prisma.UserCreateInput) {
    return this.repository.create(data);
  }
}