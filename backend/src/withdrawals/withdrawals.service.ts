import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, WithdrawalStatus } from '@prisma/client';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class WithdrawalsService {
  constructor(
    private prisma: PrismaService,
    private walletService: WalletService,
  ) {}

  async getWithdrawalHistory(user: User) {
    return this.prisma.withdrawalRequest.findMany({
      where: { organizerId: user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        payoutAccount: true,
      },
    });
  }

  async createWithdrawalRequest(user: User, { amount }: CreateWithdrawalDto) {
    const payoutAccount = await this.prisma.payoutAccount.findUnique({
      where: { userId: user.id },
    });

    if (!payoutAccount) {
      throw new ForbiddenException('Please set up your payout account before withdrawing.');
    }

    const wallet = await this.walletService.findOrCreateWalletForUser(user);

    if (amount > wallet.balance) {
      throw new BadRequestException('Withdrawal amount cannot exceed your current balance.');
    }

    // Use a transaction to ensure data consistency
    return this.prisma.$transaction(async (tx) => {
      // 1. Decrease the wallet balance
      const updatedWallet = await tx.wallet.update({
        where: { userId: user.id },
        data: {
          balance: { decrement: amount },
        },
      });

      // 2. Create the withdrawal request record
      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          organizerId: user.id,
          amount,
          payoutAccountId: payoutAccount.id,
          status: WithdrawalStatus.PENDING,
        },
      });

      return withdrawalRequest;
    });
  }
}
