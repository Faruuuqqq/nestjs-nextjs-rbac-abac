// src/modules/users/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email harus berupa alamat email yang valid.' })
  @IsNotEmpty({ message: 'Email tidak boleh kosong.' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password minimal harus 8 karakter.' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'Nama tidak boleh kosong.' })
  name: string;
}