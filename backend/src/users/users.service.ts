import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role, User } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

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

  async findMyEvents(userId: string) {
    const registeredPromise = this.prisma.registration.findMany({
      where: { userId },
      include: { event: true },
    });

    const favoritedPromise = this.prisma.favorite.findMany({
      where: { userId },
      include: { event: true },
    });

    const organizedPromise = this.prisma.event.findMany({
      where: { organizerId: userId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startAt: 'desc' },
    });

    const [registered, favorited, organized] = await Promise.all([
      registeredPromise,
      favoritedPromise,
      organizedPromise,
    ]);

    return {
      registered: registered.map((r) => r.event),
      favorited: favorited.map((f) => f.event),
      organized: organized,
    };
  }

  // 🔹 Cập nhật hoặc tạo profile
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

  // 🔹 Nâng cấp user thành Organizer
  async upgradeToOrganizer(userId: string) {
    const oldUser = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!oldUser) {
      throw new NotFoundException(`User with ID "${userId}" not found`);
    }

    const updatedUser = await this.prisma.user.update({
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

    await this.auditLogsService.log(
      userId,
      'UPGRADE_ROLE',
      'User',
      userId,
      { role: oldUser.role },
      { role: updatedUser.role },
    );

    return updatedUser;
  }
}
