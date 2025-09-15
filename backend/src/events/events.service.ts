import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { User, EventStatus, Role } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  create(createEventDto: CreateEventDto, organizer: User) {
    return this.prisma.event.create({
      data: {
        ...createEventDto,
        startAt: new Date(createEventDto.startAt),
        endAt: new Date(createEventDto.endAt),
        organizerId: organizer.id,
      },
    });
  }

  findAll() {
    return this.prisma.event.findMany({
      where: {
        OR: [
          { status: EventStatus.PUBLISHED },
          { status: EventStatus.CLOSED }
        ]
      },
      include: {
        organizer: {
          select: {
            id: true,
            email: true,
            profile: true
          }
        },
        _count: {
          select: {
            registrations: true,
            favorites: true
          }
        }
      },
      orderBy: {
        startAt: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: User) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: {
        ...updateEventDto,
        startAt: updateEventDto.startAt ? new Date(updateEventDto.startAt) : undefined,
        endAt: updateEventDto.endAt ? new Date(updateEventDto.endAt) : undefined,
      },
    });

    await this.auditLogsService.log(
      user.id,
      'UPDATE_EVENT',
      'Event',
      event.id,
      event,
      updatedEvent,
    );

    return updatedEvent;
  }

  async remove(id: string, user: User) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to delete this event');
    }

    await this.prisma.event.delete({ where: { id } });

    await this.auditLogsService.log(
      user.id,
      'DELETE_EVENT',
      'Event',
      event.id,
      event,
      null,
    );

    return { message: 'Event deleted successfully' };
  }
}