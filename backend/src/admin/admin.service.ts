import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, WithdrawalStatus, AccountStatus, EventStatus, TransactionStatus, ReportStatus, VisibilityStatus, Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { EventsService } from 'src/events/events.service';
import { PostsService } from 'src/posts/posts.service';
import { subDays, startOfDay, endOfDay, subMonths, startOfMonth, endOfMonth } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private usersService: UsersService,
    private eventsService: EventsService,
    private postsService: PostsService,
  ) { }

  async getDashboardStats() {
    // Lấy dữ liệu cần thiết song song trong 1 transaction để tăng tốc
    const [
      totalUsers,
      totalEvents,
      totalTransactions,
      totalPosts,
      openReports,
      recentUsers,
      recentEvents,
      recentOpenReports,
      recentActivities,
      completedTransactions,
    ] = await this.prisma.$transaction([
      this.prisma.user.count(),
      this.prisma.event.count(),
      this.prisma.transaction.count({ where: { status: TransactionStatus.COMPLETED } }),
      this.prisma.post.count(),
      this.prisma.report.count({ where: { status: ReportStatus.OPEN } }),
      this.prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { profile: true },
      }),
      this.prisma.event.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.report.findMany({
        where: { status: ReportStatus.OPEN },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.prisma.auditLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          actor: { include: { profile: true } },
        },
      }),
      this.prisma.transaction.findMany({
        where: { status: TransactionStatus.COMPLETED },
        select: { amount: true, orderCode: true },
      }),
    ]);

    // 🔹 Tính tổng doanh thu đúng theo quy tắc:
    // - UPG (Upgrade): cộng 100%
    // - DEP (Deposit): cộng 15%
    let totalRevenue = 0;
    for (const tx of completedTransactions) {
      if (tx.orderCode.startsWith('UPG')) {
        totalRevenue += tx.amount;
      } else if (tx.orderCode.startsWith('DEP')) {
        totalRevenue += tx.amount * 0.15;
      }
    }

    return {
      totalUsers,
      totalEvents,
      totalRevenue,
      totalTransactions,
      totalPosts,
      openReports,
      recentUsers,
      recentEvents,
      recentOpenReports,
      recentActivities,
    };
  }

  async getRevenueChartData(period: '7d' | '30d' | '12m') {
    let startDate;
    const endDate = new Date();

    if (period === '7d') {
      startDate = subDays(endDate, 6);
    } else if (period === '30d') {
      startDate = subDays(endDate, 29);
    } else if (period === '12m') {
      startDate = subMonths(endDate, 11);
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.COMPLETED,
        createdAt: {
          gte: startOfDay(startDate),
          lte: endOfDay(endDate),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const revenueMap = new Map<string, number>();

    transactions.forEach(tx => {
      let revenue = 0;
      if (tx.orderCode.startsWith('UPG')) {
        revenue = tx.amount;
      } else if (tx.orderCode.startsWith('DEP')) {
        revenue = tx.amount * 0.15;
      }

      if (revenue > 0) {
        const dateKey = period === '12m'
          ? tx.createdAt.toISOString().slice(0, 7) // YYYY-MM
          : tx.createdAt.toISOString().slice(0, 10); // YYYY-MM-DD

        revenueMap.set(dateKey, (revenueMap.get(dateKey) || 0) + revenue);
      }
    });

    const result: { date: string; revenue: number }[] = [];
    if (period === '12m') {
      for (let i = 11; i >= 0; i--) {
        const date = subMonths(endDate, i);
        const dateKey = date.toISOString().slice(0, 7);
        result.push({
          date: dateKey,
          revenue: revenueMap.get(dateKey) || 0
        });
      }
    } else {
      const days = period === '7d' ? 6 : 29;
      for (let i = days; i >= 0; i--) {
        const date = subDays(endDate, i);
        const dateKey = date.toISOString().slice(0, 10);
        result.push({
          date: dateKey,
          revenue: revenueMap.get(dateKey) || 0
        });
      }
    }

    return result;
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

  async deletePost(postId: string, adminId: string) {
    // The last argument 'adminId' signifies an admin action, bypassing ownership checks.
    return this.postsService.remove(postId, null, adminId);
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

