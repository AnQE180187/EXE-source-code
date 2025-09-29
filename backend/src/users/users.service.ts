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
  ) {}

  findAll(currentUser: User) {
    // ... (existing code)
  }

  async findUserWithProfile(userId: string) {
    // ... (existing code)
  }

  async findMyEvents(userId: string) {
    // ... (existing code)
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    // ... (existing code)
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
