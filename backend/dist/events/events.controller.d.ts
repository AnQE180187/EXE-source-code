import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto';
import { Request } from 'express';
import { FavoritesService } from 'src/favorites/favorites.service';
export declare class EventsController {
    private readonly eventsService;
    private readonly favoritesService;
    constructor(eventsService: EventsService, favoritesService: FavoritesService);
    create(createEventDto: CreateEventDto, req: Request): import(".prisma/client").Prisma.Prisma__EventClient<{
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
    findAll(query: {
        search?: string;
        price?: string;
    }): import(".prisma/client").Prisma.PrismaPromise<({
        _count: {
            registrations: number;
            favorites: number;
        };
        organizer: {
            profile: {
                displayName: string;
            } | null;
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
        organizer: {
            id: string;
            name: string;
        };
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
    toggleFavorite(id: string, req: Request): Promise<{
        favorited: boolean;
    }>;
    update(id: string, updateEventDto: UpdateEventDto, req: Request): Promise<{
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
    updateStatus(id: string, updateEventStatusDto: UpdateEventStatusDto, req: Request): Promise<{
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
    remove(id: string, req: Request): Promise<{
        message: string;
    }>;
}
