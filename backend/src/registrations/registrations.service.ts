import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { User, EventStatus, RegistrationStatus } from '@prisma/client';

@Injectable()
export class RegistrationsService {
  constructor(private prisma: PrismaService) {}

  async getRegistrationStatus(eventId: string, user: User) {
    const registration = await this.prisma.registration.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
      select: { status: true, createdAt: true }
    });

    return {
      isRegistered: !!registration,
      status: registration?.status || null,
      registeredAt: registration?.createdAt || null
    };
  }

  async create(createRegistrationDto: CreateRegistrationDto, user: User) {
    const { eventId } = createRegistrationDto;

    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID "${eventId}" not found`);
      }
      if (event.status !== EventStatus.PUBLISHED) {
        throw new BadRequestException('Event is not published');
      }
      if (event.registeredCount >= event.capacity) {
        throw new BadRequestException('Event is full');
      }

      const existingRegistration = await tx.registration.findUnique({
        where: { eventId_userId: { eventId, userId: user.id } },
      });

      if (existingRegistration) {
        throw new ConflictException('User already registered for this event');
      }

      const registration = await tx.registration.create({
        data: { eventId, userId: user.id },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      });

      return registration;
    });
  }

  async confirmDeposit(eventId: string, user: User) {
    const registration = await this.prisma.registration.findUnique({
        where: {
            eventId_userId: {
                eventId: eventId,
                userId: user.id,
            },
        },
    });

    if (!registration) {
        throw new NotFoundException(`Registration for event with ID "${eventId}" not found.`);
    }

    if (registration.status === RegistrationStatus.DEPOSITED) {
        throw new ConflictException('Deposit has already been confirmed for this registration.');
    }

    return this.prisma.registration.update({
        where: {
            id: registration.id,
        },
        data: {
            status: RegistrationStatus.DEPOSITED,
        },
    });
  }

  async remove(eventId: string, user: User) {
    return this.prisma.$transaction(async (tx) => {
      const registration = await tx.registration.findUnique({
        where: {
          eventId_userId: {
            eventId: eventId,
            userId: user.id,
          },
        },
      });

      if (!registration) {
        throw new NotFoundException(
          `Registration for event with ID "${eventId}" not found for this user`,
        );
      }

      await tx.registration.delete({
        where: {
          eventId_userId: {
            eventId: eventId,
            userId: user.id,
          },
        },
      });

      await tx.event.update({
        where: { id: registration.eventId },
        data: { registeredCount: { decrement: 1 } },
      });

      return { message: 'Registration cancelled successfully' };
    });
  }
}