import { Request } from 'express';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(req: Request): Promise<{
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
    getMyEvents(req: Request): Promise<{
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
    updateProfile(req: Request, updateProfileDto: UpdateProfileDto): Promise<{
        displayName: string;
        avatarUrl: string | null;
        city: string | null;
        bio: string | null;
        userId: string;
        interests: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    upgradeToOrganizer(req: Request): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
    }>;
}
