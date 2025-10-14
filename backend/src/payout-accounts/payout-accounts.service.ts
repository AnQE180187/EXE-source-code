import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { PayoutAccountDto } from './dto/payout-account.dto';

@Injectable()
export class PayoutAccountsService {
  constructor(private prisma: PrismaService) {}

  async getPayoutAccount(user: User) {
    const payoutAccount = await this.prisma.payoutAccount.findUnique({
      where: { userId: user.id },
    });

    if (!payoutAccount) {
      throw new NotFoundException('Payout account not found.');
    }
    return payoutAccount;
  }

  async upsertPayoutAccount(user: User, data: PayoutAccountDto) {
    return this.prisma.payoutAccount.upsert({
      where: { userId: user.id },
      update: data,
      create: {
        ...data,
        userId: user.id,
      },
    });
  }
}
