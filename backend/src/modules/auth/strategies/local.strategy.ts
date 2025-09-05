// src/modules/auth/strategies/local.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // Konfigurasi ini memberitahu Passport untuk menggunakan field 'email' sebagai username.
    super({ usernameField: 'email' });
  }

  /**
   * NestJS akan secara otomatis memanggil fungsi ini saat LocalStrategy digunakan.
   * @param email - Email yang dikirim oleh klien
   * @param password - Password yang dikirim oleh klien
   * @returns User object jika validasi berhasil
   */
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      // Jika user null, lemparkan error ini.
      throw new UnauthorizedException('Kredensial tidak valid');
    }
    // Apapun yang dikembalikan di sini akan ditambahkan ke object Request sebagai req.user
    return user;
  }
}