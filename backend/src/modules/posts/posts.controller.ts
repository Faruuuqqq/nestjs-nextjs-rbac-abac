import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PoliciesGuard } from 'src/common/guards/policies.guard';
import { CheckPolicies } from 'src/common/decorators/policies.decorator';
import { AbilityFactory, Action } from 'src/core/ability/ability.factory';
// 'Post' dari Prisma sekarang diimpor sebagai 'PostEntity' untuk menghindari konflik nama
import { Post as PostEntity } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private abilityFactory: AbilityFactory,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  // --- PERBAIKAN UTAMA DI SINI ---
  // Gunakan string literal 'Post' bukan Tipe PostEntity
  @CheckPolicies((ability) => ability.can(Action.Create, 'Post'))
  create(@Request() req, @Body() createPostDto: CreatePostDto) {
    // Ambil userId dari token dan teruskan ke service
    return this.postsService.create(createPostDto, req.user.userId);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Request() req, @Body() updatePostDto: UpdatePostDto) {
    const postToUpdate = await this.postsService.findOne(id);

    // Tambahan: Pastikan post ditemukan sebelum dicek izinnya
    if (!postToUpdate) {
      throw new NotFoundException('Postingan tidak ditemukan.');
    }
    
    const ability = this.abilityFactory.defineAbility(req.user);

    // Logika ini sudah benar, karena kita memeriksa izin terhadap objek spesifik
    if (ability.cannot(Action.Update, postToUpdate)) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk mengedit postingan ini.');
    }

    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req) {
    const postToRemove = await this.postsService.findOne(id);

    // Tambahan: Pastikan post ditemukan
    if (!postToRemove) {
      throw new NotFoundException('Postingan tidak ditemukan.');
    }

    const ability = this.abilityFactory.defineAbility(req.user);

    // Logika ini juga sudah benar
    if (ability.cannot(Action.Delete, postToRemove)) {
      throw new ForbiddenException('Anda tidak memiliki izin untuk menghapus postingan ini.');
    }

    return this.postsService.remove(id);
  }
}