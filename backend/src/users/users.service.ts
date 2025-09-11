import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) { }

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
    const registeredEvents = this.prisma.registration.findMany({
      where: { userId },
      include: { event: true },
    });

    const favoritedEvents = this.prisma.favorite.findMany({
      where: { userId },
      include: { event: true },
    });

    const [registered, favorited] = await Promise.all([
      registeredEvents,
      favoritedEvents,
    ]);

    return {
      registeredEvents: registered.map((r) => r.event),
      favoritedEvents: favorited.map((f) => f.event),
    };
  }

  // 🔹 Cập nhật hoặc tạo profile
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const oldProfile = await this.prisma.profile.findUnique({ where: { userId } });

    const updatedProfile = await this.prisma.profile.upsert({
      where: { userId },
      update: updateProfileDto,
      create: {
        userId,
        ...updateProfileDto,
      },
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
