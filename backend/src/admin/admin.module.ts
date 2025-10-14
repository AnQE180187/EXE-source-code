import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { WithdrawalsModule } from 'src/withdrawals/withdrawals.module';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [WithdrawalsModule, WalletModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
