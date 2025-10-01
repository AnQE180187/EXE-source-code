import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto'; // Import new DTO
import { User, EventStatus, Role, Prisma } from '@prisma/client';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';

@Injectable()
export class EventsService {
  constructor(
    private prisma: PrismaService,
    private auditLogsService: AuditLogsService,
  ) {}

  create(createEventDto: CreateEventDto, organizer: User) {
    const { tags, ...eventData } = createEventDto;

    const eventInput: Prisma.EventCreateInput = {
      ...eventData,
      startAt: new Date(eventData.startAt),
      endAt: new Date(eventData.endAt),
      organizer: { connect: { id: organizer.id } },
    };

    if (tags && tags.length > 0) {
      eventInput.tags = {
        create: tags.map(tagName => ({
          tag: {
            connectOrCreate: {
              where: { name: tagName },
              create: { name: tagName },
            },
          },
        })),
      };
    }

    return this.prisma.event.create({ data: eventInput });
  }

  findAll(query: { search?: string; price?: string, tag?: string }) {
    const { search, price, tag } = query;
    const where: Prisma.EventWhereInput = {
      status: { in: [EventStatus.PUBLISHED, EventStatus.CLOSED] },
      AND: [], // Initialize AND as an array
    };

    if (search) {
      (where.AND as Prisma.EventWhereInput[]).push({
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (price && price !== 'all') {
      if (price === 'free') {
        (where.AND as Prisma.EventWhereInput[]).push({ price: { lte: 0 } });
      } else if (price === 'paid') {
        (where.AND as Prisma.EventWhereInput[]).push({ price: { gt: 0 } });
      }
    }

    if (tag && tag !== 'all') {
        (where.AND as Prisma.EventWhereInput[]).push({
            tags: {
                some: {
                    tag: {
                        name: tag
                    }
                }
            }
        });
    }

    return this.prisma.event.findMany({
      where,
      include: {
        organizer: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
              }
            }
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
      include: {
        organizer: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        tags: { include: { tag: true } }, // Include tags
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    const { organizer, ...rest } = event;
    return {
      ...rest,
      organizer: {
        id: organizer.id,
        name: organizer.profile?.displayName || 'Không rõ',
        avatarUrl: organizer.profile?.avatarUrl || null,
      },
    };
  }

  async getRegistrationsForEvent(eventId: string, user: User) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }

    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to view registrations for this event');
    }

    return this.prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            email: true,
            profile: {
              select: {
                displayName: true,
              }
            }
          }
        }
      }
    });
  }

  async update(id: string, updateEventDto: UpdateEventDto, user: User) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this event');
    }

    const { tags, ...eventData } = updateEventDto;
    const dataToUpdate: Prisma.EventUpdateInput = { ...eventData };

    if (eventData.startAt) dataToUpdate.startAt = new Date(eventData.startAt);
    if (eventData.endAt) dataToUpdate.endAt = new Date(eventData.endAt);

    // Handle tags separately for update
    if (tags) {
        dataToUpdate.tags = {
            deleteMany: {}, // First, disconnect all existing tags
            create: tags.map(tagName => ({ // Then, create connections to the new set of tags
                tag: {
                    connectOrCreate: {
                        where: { name: tagName },
                        create: { name: tagName },
                    },
                },
            })),
        };
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: dataToUpdate,
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

  // New dedicated service for status change
  async updateStatus(id: string, updateEventStatusDto: UpdateEventStatusDto, user: User) {
    const event = await this.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException(`Event with ID "${id}" not found`);
    }

    if (event.organizerId !== user.id && user.role !== Role.ADMIN) {
      throw new ForbiddenException('You are not authorized to update this event status');
    }

    const updatedEvent = await this.prisma.event.update({
      where: { id },
      data: { status: updateEventStatusDto.status },
    });

    await this.auditLogsService.log(
      user.id,
      'UPDATE_EVENT_STATUS',
      'Event',
      event.id,
      { status: event.status },
      { status: updatedEvent.status },
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

  findManagedByMe(organizer: User) {
    return this.prisma.event.findMany({
      where: { organizerId: organizer.id },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { startAt: 'desc' },
    });
  }
}