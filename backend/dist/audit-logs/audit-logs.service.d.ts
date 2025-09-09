import { PrismaService } from 'src/prisma/prisma.service';
export declare class AuditLogsService {
    private prisma;
    constructor(prisma: PrismaService);
    log(actorId: string | null, action: string, entityType: string, entityId: string | null, before?: any, after?: any): Promise<void>;
}
