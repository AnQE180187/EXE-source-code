import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, VisibilityStatus } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto, author: User) {
    const { tags, ...postData } = createPostDto;
    return this.prisma.post.create({
      data: {
        ...postData,
        authorId: author.id,
        tags: {
          create: tags?.map((tagName) => ({
            tag: {
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
      include: { tags: { select: { tag: true } } },
    });
  }

  findAll() {
    return this.prisma.post.findMany({
      where: { status: VisibilityStatus.VISIBLE },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              }
            }
          }
        },
        tags: { select: { tag: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id, status: VisibilityStatus.VISIBLE },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        tags: { select: { tag: true } },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                profile: {
                  select: {
                    displayName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    if (post.authorId !== userId) {
      throw new NotFoundException(`Post with ID "${id}" not found`); // Or ForbiddenException
    }

    const { tags, ...postData } = updatePostDto;

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        tags: tags
          ? {
            deleteMany: {}, // Xoá tất cả tags cũ
            create: tags.map((tagName) => ({
              tag: {
                connectOrCreate: {
                  where: { name: tagName },
                  create: { name: tagName },
                },
              },
            })),
          }
          : undefined,
      },
      include: { tags: { select: { tag: true } } },
    });
  }

  async remove(id: string, userId: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }
    if (post.authorId !== userId) {
      throw new NotFoundException(`Post with ID "${id}" not found`); // Or ForbiddenException
    }

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted successfully' };
  }
}
