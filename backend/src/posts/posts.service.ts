import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, VisibilityStatus } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) { }

  async create(createPostDto: CreatePostDto, author: User) {
    const { forumTags, ...postData } = createPostDto;
    // Tạo post trước
    const post = await this.prisma.post.create({
      data: {
        ...postData,
        authorId: author.id,
      },
    });

    // Gán tag cho post
    if (forumTags && forumTags.length > 0) {
      await Promise.all(
        forumTags.map(async (tagName) => {
          // Tìm hoặc tạo ForumTag
          const forumTag = await this.prisma.forumTag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          // Tạo liên kết PostForumTag
          await this.prisma.postForumTag.create({
            data: {
              postId: post.id,
              tagId: forumTag.id,
            },
          });
        })
      );
    }

    // Trả về post kèm tag liên kết
    return this.prisma.post.findUnique({
      where: { id: post.id },
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
          forumTags: { select: { tag: true } },
      },
    });
  }

  findAll(tag?: string) {
    const where: any = { status: VisibilityStatus.VISIBLE };
    if (tag) {
      where.forumTags = {
        some: {
          tag: {
            name: tag,
          },
        },
      };
    }
    return this.prisma.post.findMany({
      where,
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
        forumTags: { select: { tag: true } },
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
          forumTags: { select: { tag: true } },
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

    const { forumTags, ...postData } = updatePostDto;

    // Cập nhật post
    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
      },
    });

    // Xoá tất cả liên kết tag cũ
  await this.prisma.postForumTag.deleteMany({ where: { postId: id } });

    // Tạo lại liên kết tag mới
    if (forumTags && forumTags.length > 0) {
      await Promise.all(
        forumTags.map(async (tagName) => {
          // Tìm hoặc tạo ForumTag
          const forumTag = await this.prisma.forumTag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          // Tạo liên kết PostForumTag
          await this.prisma.postForumTag.create({
            data: {
              postId: id,
              tagId: forumTag.id,
            },
          });
        })
      );
    }

    // Trả về post kèm tag liên kết
    return this.prisma.post.findUnique({
      where: { id },
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
          forumTags: { select: { tag: true } },
      },
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
