import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersService {
    private prisma;
    private auditLogsService;
    constructor(prisma: PrismaService, auditLogsService: AuditLogsService);
    findAll(currentUser: User): Promise<{
        profile: {
            displayName: string;
            avatarUrl: string | null;
            city: string | null;
            bio: string | null;
            interests: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
        } | null;
        email: string;
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
    }[]>;
    findUserWithProfile(userId: string): Promise<{
        profile: {
            displayName: string;
            avatarUrl: string | null;
            city: string | null;
            bio: string | null;
            interests: import("@prisma/client/runtime/library").JsonValue | null;
            userId: string;
        } | null;
        email: string;
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
    }>;
    findMyEvents(userId: string): Promise<{
        registeredEvents: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.EventStatus;
            updatedAt: Date;
            organizerId: string;
            title: string;
            slug: string | null;
            description: string;
            locationText: string;
            lat: number | null;
            lng: number | null;
            startAt: Date;
            endAt: Date;
            price: number | null;
            capacity: number;
            favoritesCount: number;
            registeredCount: number;
        }[];
        favoritedEvents: {
            id: string;
            createdAt: Date;
            status: import(".prisma/client").$Enums.EventStatus;
            updatedAt: Date;
            organizerId: string;
            title: string;
            slug: string | null;
            description: string;
            locationText: string;
            lat: number | null;
            lng: number | null;
            startAt: Date;
            endAt: Date;
            price: number | null;
            capacity: number;
            favoritesCount: number;
            registeredCount: number;
        }[];
    }>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<{
        displayName: string;
        avatarUrl: string | null;
        city: string | null;
        bio: string | null;
        interests: import("@prisma/client/runtime/library").JsonValue | null;
        userId: string;
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
