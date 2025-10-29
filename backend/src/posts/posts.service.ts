import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User, VisibilityStatus, Prisma } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private auditLogs: AuditLogsService,
  ) { }

  async create(createPostDto: CreatePostDto, author: User) {
    const { forumTags, ...postData } = createPostDto;
    // Create post first
    const post = await this.prisma.post.create({
      data: {
        ...postData,
        authorId: author.id,
      },
    });

    // Assign tags to the post
    if (forumTags && forumTags.length > 0) {
      await Promise.all(
        forumTags.map(async (tagName) => {
          const forumTag = await this.prisma.forumTag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          await this.prisma.postForumTag.create({
            data: {
              postId: post.id,
              tagId: forumTag.id,
            },
          });
        })
      );
    }

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

  async findAll(params?: { tag?: string, sortBy?: string }, userId?: string) {
    const { tag, sortBy } = params || {};
    const posts = await this.prisma.post.findMany({
      where: {
        status: VisibilityStatus.VISIBLE,
        ...(tag ? { forumTags: { some: { tag: { name: tag } } } } : {}),
      },
      include: {
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
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
        likes: userId ? { where: { userId } } : undefined,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (sortBy === 'popular') {
      return posts.sort((a, b) => {
        const aPopularity = (a._count.likes || 0) + (a._count.comments || 0);
        const bPopularity = (b._count.likes || 0) + (b._count.comments || 0);
        return bPopularity - aPopularity;
      });
    }

    return posts;
  }

  async findAllForAdmin(page: number, limit: number, search?: string, status?: VisibilityStatus) {
    const where: Prisma.PostWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { author: { profile: { displayName: { contains: search, mode: 'insensitive' } } } },
        { author: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (status) {
      where.status = status;
    }

    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
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
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: string, userId?: string) {
    const post = await this.prisma.post.findFirst({
      where: { 
        id, 
        OR: [
          { status: VisibilityStatus.VISIBLE },
          { authorId: userId }
        ]
      },
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
        likes: userId ? { where: { userId } } : undefined,
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
      throw new ForbiddenException('You are not allowed to edit this post');
    }

    const { forumTags, ...postData } = updatePostDto;

    const oldPost = { ...post };

    const updatedPost = await this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
      },
    });

    await this.auditLogs.log(
      userId,
      'POST_UPDATE',
      'Post',
      id,
      oldPost,
      updatedPost,
    );

    await this.prisma.postForumTag.deleteMany({ where: { postId: id } });

    if (forumTags && forumTags.length > 0) {
      await Promise.all(
        forumTags.map(async (tagName) => {
          const forumTag = await this.prisma.forumTag.upsert({
            where: { name: tagName },
            update: {},
            create: { name: tagName },
          });
          await this.prisma.postForumTag.create({
            data: {
              postId: id,
              tagId: forumTag.id,
            },
          });
        })
      );
    }

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

  async updateStatus(postId: string, status: VisibilityStatus, adminId: string) {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }

    const oldPost = { ...post };

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: { status },
    });

    await this.auditLogs.log(
      adminId,
      status === VisibilityStatus.HIDDEN ? 'POST_HIDE' : 'POST_SHOW',
      'Post',
      postId,
      oldPost,
      updatedPost,
    );

    return updatedPost;
  }

  async remove(id: string, userId: string | null, adminId?: string) {
    const post = await this.prisma.post.findUnique({ where: { id } });
    if (!post) {
      throw new NotFoundException(`Post with ID "${id}" not found`);
    }

    // If an admin is performing the action, skip the ownership check
    if (!adminId && post.authorId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }

    const actorId = adminId || userId;
    await this.auditLogs.log(actorId, 'POST_DELETE', 'Post', id, post, null);

    await this.prisma.post.delete({ where: { id } });
    return { message: 'Post deleted successfully' };
  }
}
