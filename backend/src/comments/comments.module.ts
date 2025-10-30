import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, NotificationsModule],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
