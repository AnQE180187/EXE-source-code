import { CreateEventDto } from './create-event.dto';
import { EventStatus } from '@prisma/client';
declare const UpdateEventDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateEventDto>>;
export declare class UpdateEventDto extends UpdateEventDto_base {
    title?: string;
    description?: string;
    locationText?: string;
    startAt?: string;
    endAt?: string;
    price?: number;
    capacity?: number;
    status?: EventStatus;
}
export {};
