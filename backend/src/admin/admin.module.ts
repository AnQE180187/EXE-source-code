import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { WithdrawalsModule } from 'src/withdrawals/withdrawals.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { UsersModule } from 'src/users/users.module';
import { EventsModule } from 'src/events/events.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports: [WithdrawalsModule, WalletModule, UsersModule, EventsModule, PostsModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
