import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { TagsModule } from './tags/tags.module';
import { RegistrationsModule } from './registrations/registrations.module';
import { FavoritesModule } from './favorites/favorites.module';
import { ReportsModule } from './reports/reports.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { UploadModule } from './upload/upload.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ForumTagsModule } from './forum-tags/forum-tags.module';
import { ChatModule } from './chat/chat.module';
import { PayoutAccountsModule } from './payout-accounts/payout-accounts.module';
import { WalletModule } from './wallet/wallet.module';
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { AdminModule } from './admin/admin.module';
import { PostLikesModule } from './post-likes/post-likes.module';
import { ChatbotModule } from './chatbot/chatbot.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    EventsModule,
    AuthModule,
    PrismaModule,
    PostsModule,
    CommentsModule,
    TagsModule,
    RegistrationsModule,
    FavoritesModule,
    ReportsModule,
    AuditLogsModule,
    UploadModule,
    TransactionsModule,
    ForumTagsModule,
    ChatModule,
    PayoutAccountsModule,
    WalletModule,
    WithdrawalsModule,
    AdminModule,
    PostLikesModule,
    ChatbotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
