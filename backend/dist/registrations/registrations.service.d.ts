import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { User } from '@prisma/client';
export declare class RegistrationsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createRegistrationDto: CreateRegistrationDto, user: User): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.RegistrationStatus;
        userId: string;
        eventId: string;
    }>;
    remove(eventId: string, user: User): Promise<{
        message: string;
    }>;
}
