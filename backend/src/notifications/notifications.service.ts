import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService, private gateway: NotificationsGateway) {}

  async getUserNotifications(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { actor: { select: { id: true, profile: { select: { displayName: true, avatarUrl: true } }, email: true } } }
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async createLikeNotification(actorId: string, postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, title: true },
    });
    if (!post || post.authorId === actorId) return null;
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { profile: { select: { displayName: true, avatarUrl: true } }, email: true },
    });
    const displayName = actor ? (actor.profile?.displayName || actor.email || 'Ai đó') : 'Ai đó';
    const notification = await this.prisma.notification.create({
      data: {
        type: 'LIKE',
        content: `${displayName} vừa thích bài viết của bạn: "${post.title}"`,
        link: `/forum/${postId}`,
        userId: post.authorId,
        actorId,
      }
    });
    this.gateway.sendNotificationToUser(post.authorId, notification);
    return notification;
  }

  async createCommentNotification(actorId: string, postId: string, commentContent: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { authorId: true, title: true },
    });
    if (!post || post.authorId === actorId) return null;
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { profile: { select: { displayName: true, avatarUrl: true } }, email: true },
    });
    const displayName = actor ? (actor.profile?.displayName || actor.email || 'Ai đó') : 'Ai đó';
    const notification = await this.prisma.notification.create({
      data: {
        type: 'COMMENT',
        content: `${displayName} đã bình luận: "${commentContent}" trên bài viết: "${post.title}"`,
        link: `/forum/${postId}`,
        userId: post.authorId,
        actorId,
      }
    });
    this.gateway.sendNotificationToUser(post.authorId, notification);
    return notification;
  }

  async createFavoriteNotification(actorId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId }, select: { organizerId: true, title: true } });
    if (!event || event.organizerId === actorId) return null;
    const actor = await this.prisma.user.findUnique({
      where: { id: actorId },
      select: { profile: { select: { displayName: true, avatarUrl: true } }, email: true },
    });
    const displayName = actor ? (actor.profile?.displayName || actor.email || 'Ai đó') : 'Ai đó';
    const notification = await this.prisma.notification.create({
      data: {
        type: 'FAVORITE',
        content: `${displayName} đã thêm sự kiện của bạn "${event.title}" vào mục yêu thích`,
        link: `/events/${eventId}`,
        userId: event.organizerId,
        actorId,
      }
    });
    this.gateway.sendNotificationToUser(event.organizerId, notification);
    return notification;
  }
}
