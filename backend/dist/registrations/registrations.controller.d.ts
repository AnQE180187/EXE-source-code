import { RegistrationsService } from './registrations.service';
import { Request } from 'express';
export declare class RegistrationsController {
    private readonly registrationsService;
    constructor(registrationsService: RegistrationsService);
    create(eventId: string, req: Request): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        eventId: string;
        userId: string;
    }>;
    remove(eventId: string, req: Request): Promise<{
        message: string;
    }>;
}
