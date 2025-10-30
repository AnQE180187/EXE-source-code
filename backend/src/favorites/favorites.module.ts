import { Module } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [FavoritesService],
  exports: [FavoritesService],
})
export class FavoritesModule {}
