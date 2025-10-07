import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('forum-tags')
export class ForumTagsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.forumTag.findMany({
      orderBy: { name: 'asc' },
    });
  }
}
