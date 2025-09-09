import { PrismaService } from 'src/prisma/prisma.service';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    private auditLogsService;
    constructor(prisma: PrismaService, auditLogsService: AuditLogsService);
    findUserWithProfile(userId: string): Promise<{
        profile: {
            displayName: string;
            avatarUrl: string | null;
            city: string | null;
            bio: string | null;
            userId: string;
            interests: import("@prisma/client/runtime/library").JsonValue | null;
        } | null;
        email: string;
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        displayName: string;
        avatarUrl: string | null;
        city: string | null;
        bio: string | null;
        userId: string;
        interests: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    upgradeToOrganizer(userId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
    }>;
}
