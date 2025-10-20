import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { NotificationsService } from 'src/notifications/notifications.service';
import { NotificationType } from 'src/notifications/enums/notification-type.enum';

@Injectable()
export class PostLikesService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async toggleLike(postId: string, user: User) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID "${postId}" not found`);
    }

    const like = await this.prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId: postId,
        },
      },
    });

    if (like) {
      // User has already liked the post, so unlike it.
      await this.prisma.postLike.delete({
        where: {
          userId_postId: {
            userId: user.id,
            postId: postId,
          },
        },
      });

      // Decrement the likes count
      await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      });

      return { liked: false };
    } else {
      // User has not liked the post, so like it.
      await this.prisma.postLike.create({
        data: {
          postId: postId,
          userId: user.id,
        },
      });

      // Increment the likes count
      const updatedPost = await this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      });

      // Create a notification for the post author
      if (post.authorId !== user.id) {
        await this.notificationsService.createNotification(
          post.authorId,
          NotificationType.POST_LIKED,
          {
            postId: post.id,
            postTitle: post.title,
            likedByUserId: user.id,
          },
        );
      }

      return { liked: true };
    }
  }
}
