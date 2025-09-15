import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
export declare class EventsService {
    private prisma;
    private auditLogsService;
    constructor(prisma: PrismaService, auditLogsService: AuditLogsService);
    create(createEventDto: CreateEventDto, organizer: User): import(".prisma/client").Prisma.Prisma__EventClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            registrations: number;
            favorites: number;
        };
        organizer: {
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
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
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
    }>;
    update(id: string, updateEventDto: UpdateEventDto, user: User): Promise<{
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
    }>;
    remove(id: string, user: User): Promise<{
        message: string;
    }>;
}
