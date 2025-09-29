import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {}

  async toggleFavorite(eventId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Check if the event exists first
      const event = await tx.event.findUnique({ where: { id: eventId } });
      if (!event) {
        throw new NotFoundException(`Event with ID "${eventId}" not found`);
      }

      const existingFavorite = await tx.favorite.findUnique({
        where: { userId_eventId: { userId, eventId } },
      });

      if (existingFavorite) {
        // User has already favorited, so unfavorite it
        await tx.favorite.delete({
          where: { userId_eventId: { userId, eventId } },
        });
        await tx.event.update({
          where: { id: eventId },
          data: { favoritesCount: { decrement: 1 } },
        });
        return { isFavorited: false };
      } else {
        // User has not favorited, so favorite it
        await tx.favorite.create({
          data: { userId, eventId },
        });
        await tx.event.update({
          where: { id: eventId },
          data: { favoritesCount: { increment: 1 } },
        });
        return { isFavorited: true };
      }
    });
  }

  async getFavoriteStatus(eventId: string, userId: string) {
    const favorite = await this.prisma.favorite.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    return { isFavorited: !!favorite };
  }
}