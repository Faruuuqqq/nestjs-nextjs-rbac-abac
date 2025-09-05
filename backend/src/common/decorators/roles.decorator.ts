import { SetMetadata } from '@nestjs/common';

// Ini adalah kunci yang akan kita gunakan untuk menyimpan dan mengambil metadata peran
export const ROLES_KEY = 'roles';

/**
 * Decorator untuk menetapkan peran yang diperlukan untuk mengakses sebuah endpoint.
 * Contoh penggunaan: @Roles('ADMIN', 'MANAGER')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);