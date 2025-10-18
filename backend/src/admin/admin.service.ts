import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, WithdrawalStatus, AccountStatus, EventStatus, TransactionStatus, ReportStatus, VisibilityStatus } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { PostsService } from 'src/posts/posts.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private postsService: PostsService,
  ) { }

  async getDashboardStats() {
    const [totalUsers, totalEvents, totalRevenue, totalTransactions, totalPosts, openReports, recentUsers, recentEvents, recentOpenReports, recentActivities] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.event.count(),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: TransactionStatus.COMPLETED },
      }),
      this.prisma.transaction.count({ where: { status: TransactionStatus.COMPLETED } }),
      this.prisma.post.count(),
      this.prisma.report.count({ where: { status: ReportStatus.OPEN } }),
      this.prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { profile: true } }),
      this.prisma.event.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      this.prisma.report.findMany({ where: { status: ReportStatus.OPEN }, orderBy: { createdAt: 'desc' }, take: 5 }),
      this.prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { actor: { include: { profile: true } } } }),
    ]);

    return {
      totalUsers,
      totalEvents,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalTransactions,
      totalPosts,
      openReports,
      recentUsers,
      recentEvents,
      recentOpenReports,
      recentActivities,
    };
  }

  async getUsers(
    page: number,
    limit: number,
    search?: string,
    role?: Role,
    status?: AccountStatus,
  ) {
    return this.usersService.getUsersForAdmin(page, limit, search, role, status);
  }

  async getEvents(
    page: number,
    limit: number,
    search?: string,
    status?: EventStatus,
  ) {
    return this.eventsService.findAllForAdmin(page, limit, search, status);
  }

  async getPosts(
    page: number,
    limit: number,
    search?: string,
    status?: VisibilityStatus,
  ) {
    return this.postsService.findAllForAdmin(page, limit, search, status);
  }

  async updateUserRole(userId: string, role: Role, adminId: string) {
    return this.usersService.updateUserRole(userId, role, adminId);
  }

  async updateUserStatus(userId: string, status: AccountStatus, adminId: string) {
    return this.usersService.updateUserStatus(userId, status, adminId);
  }

  async updateEventStatus(eventId: string, status: EventStatus, adminId: string) {
    const admin = await this.usersService.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin not found');
    }
    return this.eventsService.updateStatus(eventId, { status }, admin);
  }

  async updatePostStatus(postId: string, status: VisibilityStatus, adminId: string) {
    return this.postsService.updateStatus(postId, status, adminId);
  }

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

    // Determine the amount to refund. Use the original requested amount if available,
    // otherwise fall back to the stored (85%) amount for older records.
    const amountToRefund = request.requestedAmount ?? request.amount;

    // Use a transaction to refund the balance and update the request
    return this.prisma.$transaction(async (tx) => {
      // 1. Refund the correct amount to the organizer's wallet
      await tx.wallet.update({
        where: { userId: request.organizerId },
        data: {
          balance: { increment: amountToRefund },
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

