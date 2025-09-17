import { EventStatus } from '@prisma/client';
export declare class CreateEventDto {
    title: string;
    description: string;
    locationText: string;
    startAt: string;
    endAt: string;
    price?: number;
    capacity?: number;
    status?: EventStatus;
}
