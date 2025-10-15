import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Role, User, AccountStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

// Define a type for the Prisma Transactional Client
type PrismaTx = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) { }

  async findById(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async findAll(currentUser: User) {
    // Chỉ ADMIN mới có thể xem tất cả thông tin user
    const select = currentUser.role === Role.ADMIN ? {
      id: true,
      email: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      profile: true,
    } : {
      id: true,
      email: true,
      role: true,
      profile: {
        select: {
          displayName: true,
          avatarUrl: true,
        }
      }
    };

    return this.prisma.user.findMany({
      select,
      orderBy: { createdAt: 'desc' },
    });
  }

  // 🔹 Trả user kèm profile, nhưng không có passwordHash
  async findUserWithProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        profile: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    return user;
  }

  findMyManagedEvents(userId: string) {
    return this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startAt: 'desc' },
    });
  }

  async findUserActivityEvents(userId: string) {
    const registeredPromise = this.prisma.registration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });

    const favoritedPromise = this.prisma.favorite.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: 'desc' },
    });

    const [registered, favorited] = await Promise.all([
      registeredPromise,
      favoritedPromise,
    ]);

    return {
      registered: registered.map((r) => r.event),
      favorited: favorited.map((f) => f.event),
    };
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const oldProfile = await this.prisma.profile.findUnique({ where: { userId } });

    const { dateOfBirth, ...restOfDto } = updateProfileDto;

    // Prisma expects a Date object or a full ISO string for DateTime fields.
    // The DTO provides a string (like YYYY-MM-DD) or null. We convert it.
    const dataForUpdate = {
      ...restOfDto,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    };

    const dataForCreate = {
      userId,
      ...dataForUpdate,
      displayName: dataForUpdate.displayName || user.email,
    };

    const updatedProfile = await this.prisma.profile.upsert({
      where: { userId },
      update: dataForUpdate,
      create: dataForCreate,
    });

    await this.auditLogsService.log(
      userId,
      'UPDATE_PROFILE',
      'Profile',
      userId,
      oldProfile,
      updatedProfile,
    );

    return updatedProfile;
  }

  async getUsersForAdmin(
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: Role,
    status?: AccountStatus,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.UserWhereInput = {};

    if (search) {
      where.OR = [
        { profile: { displayName: { contains: search, mode: 'insensitive' } } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const [users, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  async updateUserRole(userId: string, role: Role, adminId: string) {
    const userToUpdate = await this.findUserWithProfile(userId); // Reuse to check existence

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    await this.auditLogsService.log(
      adminId,
      'UPDATE_USER_ROLE',
      'User',
      userId,
      { role: userToUpdate.role },
      { role: updatedUser.role },
    );

    return updatedUser;
  }

  async updateUserStatus(userId: string, status: AccountStatus, adminId: string) {
    const userToUpdate = await this.findUserWithProfile(userId); // Reuse to check existence

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: { status },
    });

    await this.auditLogsService.log(
      adminId,
      'UPDATE_USER_STATUS',
      'User',
      userId,
      { status: userToUpdate.status },
      { status: updatedUser.status },
    );

    return updatedUser;
  }

  // Overload the method to accept an optional transaction client
  async upgradeToOrganizer(userId: string, prisma: PrismaTx = this.prisma) {
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!oldUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    if (oldUser.role === Role.ORGANIZER) {
      // User is already an organizer, no need to do anything.
      return oldUser;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: Role.ORGANIZER },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Note: Audit logging should ideally also use the transaction client if possible,
    // but it's a separate concern. For now, we log after the main transaction succeeds.
    await this.auditLogsService.log(
      userId,
      'UPGRADE_ROLE_VIA_PAYMENT',
      'User',
      userId,
      { role: oldUser.role },
      { role: updatedUser.role },
    );

    return updatedUser;
  }
}
