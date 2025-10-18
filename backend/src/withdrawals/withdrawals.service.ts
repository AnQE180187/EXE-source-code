import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, WithdrawalStatus } from '@prisma/client';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';
import { WalletService } from 'src/wallet/wallet.service';

const COMMISSION_RATE = 0.15; // 15% commission

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

  async createWithdrawalRequest(user: User, { amount: requestedAmount }: CreateWithdrawalDto) {
    const payoutAccount = await this.prisma.payoutAccount.findUnique({
      where: { userId: user.id },
    });

    if (!payoutAccount) {
      throw new ForbiddenException('Please set up your payout account before withdrawing.');
    }

    const wallet = await this.walletService.findOrCreateWalletForUser(user);

    if (requestedAmount > wallet.balance) {
      throw new BadRequestException('Withdrawal amount cannot exceed your current balance.');
    }

    if (requestedAmount <= 0) {
        throw new BadRequestException('Withdrawal amount must be positive.');
    }

    const commission = requestedAmount * COMMISSION_RATE;
    const finalAmount = requestedAmount - commission;

    // Use a transaction to ensure data consistency
    return this.prisma.$transaction(async (tx) => {
      // 1. Decrease the wallet balance by the full requested amount
      await tx.wallet.update({
        where: { userId: user.id },
        data: {
          balance: { decrement: requestedAmount },
        },
      });

      // 2. Create the withdrawal request record with both amounts
      const withdrawalRequest = await tx.withdrawalRequest.create({
        data: {
          organizerId: user.id,
          requestedAmount: requestedAmount, // Store the original amount
          amount: finalAmount, // Store the amount after commission
          payoutAccountId: payoutAccount.id,
          status: WithdrawalStatus.PENDING,
        },
      });

      // TODO: Optionally, create a transaction record for the commission itself

      return withdrawalRequest;
    });
  }
}
