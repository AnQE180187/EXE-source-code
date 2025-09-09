import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class AuditLogsService {
  constructor(private prisma: PrismaService) {}

  async log(
    actorId: string | null,
    action: string,
    entityType: string,
    entityId: string | null,
    before?: any,
    after?: any,
  ) {
    await this.prisma.auditLog.create({
      data: {
        actorId,
        action,
        entityType,
        entityId,
        before: before ? JSON.stringify(before) : undefined,
        after: after ? JSON.stringify(after) : undefined,
      },
    });
  }
}