// src/modules/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  // Daftarkan semua class yang akan digunakan dalam modul ini
  providers: [UsersService, UsersRepository],
  // Ekspor UsersService agar bisa digunakan oleh modul lain
  // (seperti modul Auth yang akan kita buat selanjutnya)
  exports: [UsersService],
})
export class UsersModule {}