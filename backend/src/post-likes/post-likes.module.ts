import { Module } from '@nestjs/common';
import { PostLikesService } from './post-likes.service';
import { PostLikesController } from './post-likes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PostLikesController],
  providers: [PostLikesService],
  exports: [PostLikesService],
})
export class PostLikesModule {}