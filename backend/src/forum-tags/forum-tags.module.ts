import { Module } from '@nestjs/common';
import { ForumTagsController } from './forum-tags.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ForumTagsController],
  providers: [PrismaService],
})
export class ForumTagsModule {}
