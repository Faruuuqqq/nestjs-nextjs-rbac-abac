// src/core/ability/ability.module.ts
import { Module } from '@nestjs/common';
import { AbilityFactory } from './ability.factory';

@Module({
  providers: [AbilityFactory],
  exports: [AbilityFactory], // Ekspor agar bisa digunakan di modul lain
})
export class AbilityModule {}