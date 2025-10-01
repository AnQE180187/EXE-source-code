import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaClient, Role, User } from '@prisma/client';
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
