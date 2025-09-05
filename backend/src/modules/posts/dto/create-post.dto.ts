import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'Judul postingan' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Konten postingan', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({
    description: 'Status publikasi postingan',
    default: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}