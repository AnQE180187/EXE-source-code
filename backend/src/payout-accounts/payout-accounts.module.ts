import { Module } from '@nestjs/common';
import { PayoutAccountsController } from './payout-accounts.controller';
import { PayoutAccountsService } from './payout-accounts.service';

@Module({
  controllers: [PayoutAccountsController],
  providers: [PayoutAccountsService],
})
export class PayoutAccountsModule {}
