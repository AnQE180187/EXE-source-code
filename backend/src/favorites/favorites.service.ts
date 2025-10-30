import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService, private notificationsService: NotificationsService) {}

  async toggleFavorite(eventId: string, user: User) {
    const event = await this.prisma.event.findUnique({ where: { id: eventId } });
    if (!event) throw new NotFoundException('Sự kiện không tồn tại');
    const favorite = await this.prisma.favorite.findUnique({ where: { userId_eventId: { userId: user.id, eventId } } });
    if (favorite) {
      await this.prisma.favorite.delete({ where: { userId_eventId: { userId: user.id, eventId } } });
      return { favorited: false };
    } else {
      await this.prisma.favorite.create({ data: { userId: user.id, eventId } });
      // Gửi notify cho organizer nếu user khác organizer
      await this.notificationsService.createFavoriteNotification(user.id, eventId);
      return { favorited: true };
    }
  }

  async getFavoriteStatus(eventId: string, userId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    return { isFavorited: !!favorite };
  }
}