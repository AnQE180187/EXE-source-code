import { Module } from '@nestjs/common';
import { WithdrawalsController } from './withdrawals.controller';
import { WithdrawalsService } from './withdrawals.service';
import { WalletModule } from 'src/wallet/wallet.module';

@Module({
  imports: [WalletModule], // Import WalletModule to use WalletService
  controllers: [WithdrawalsController],
  providers: [WithdrawalsService],
})
export class WithdrawalsModule {}
