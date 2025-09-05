import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AbilityModule } from 'src/core/ability/ability.module';

@Module({
  imports: [AbilityModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}