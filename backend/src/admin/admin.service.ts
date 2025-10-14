import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WithdrawalStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getWithdrawals(status?: WithdrawalStatus) {
    return this.prisma.withdrawalRequest.findMany({
      where: {
        status: status,
      },
      include: {
        organizer: {
          select: {
            email: true,
            profile: {
              select: {
                displayName: true,
              },
            },
          },
        },
        payoutAccount: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async approveWithdrawal(withdrawalId: string) {
    const request = await this.prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!request || request.status !== WithdrawalStatus.PENDING) {
      throw new NotFoundException('Pending withdrawal request not found.');
    }

    return this.prisma.withdrawalRequest.update({
      where: { id: withdrawalId },
      data: {
        status: WithdrawalStatus.COMPLETED,
        processedAt: new Date(),
      },
    });
  }

  async rejectWithdrawal(withdrawalId: string) {
    const request = await this.prisma.withdrawalRequest.findUnique({
      where: { id: withdrawalId },
    });

    if (!request || request.status !== WithdrawalStatus.PENDING) {
      throw new NotFoundException('Pending withdrawal request not found.');
    }

    // Use a transaction to refund the balance and update the request
    return this.prisma.$transaction(async (tx) => {
      // 1. Refund the amount to the organizer's wallet
      await tx.wallet.update({
        where: { userId: request.organizerId },
        data: {
          balance: { increment: request.amount },
        },
      });

      // 2. Mark the withdrawal request as FAILED
      const rejectedRequest = await tx.withdrawalRequest.update({
        where: { id: withdrawalId },
        data: {
          status: WithdrawalStatus.FAILED,
          processedAt: new Date(),
        },
      });

      return rejectedRequest;
    });
  }

  async getAllWallets() {
    return this.prisma.wallet.findMany({
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                displayName: true,
              },
            },
          },
        },
      },
      orderBy: {
        balance: 'desc',
      },
    });
  }
}
