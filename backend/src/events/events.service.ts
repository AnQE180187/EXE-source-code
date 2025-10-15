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

  findAll(query: { search?: string; price?: string, tag?: string, date?: string, location?: string, category?: string, sort?: string, min_registrations?: string }) {
    const { search, price, tag, date, location, category, sort, min_registrations } = query;
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

    if (date) {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      let endDate;

      switch (date) {
        case 'today':
          endDate = new Date(now);
          endDate.setHours(23, 59, 59, 999);
          (where.AND as Prisma.EventWhereInput[]).push({ startAt: { gte: now, lte: endDate } });
          break;
        case 'weekend':
          const dayOfWeek = now.getDay();
          const nextSaturday = new Date(now);
          nextSaturday.setDate(now.getDate() - dayOfWeek + 6);
          nextSaturday.setHours(23, 59, 59, 999);
          (where.AND as Prisma.EventWhereInput[]).push({ startAt: { gte: now, lte: nextSaturday } });
          break;
        case 'month':
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
          endDate.setHours(23, 59, 59, 999);
          (where.AND as Prisma.EventWhereInput[]).push({ startAt: { gte: now, lte: endDate } });
          break;
      }
    }

    if (location) {
      (where.AND as Prisma.EventWhereInput[]).push({
        locationText: { contains: location, mode: 'insensitive' }
      });
    }

    if (category && category !== 'all') {
      (where.AND as Prisma.EventWhereInput[]).push({
        tags: {
          some: {
            tag: {
              name: category
            }
          }
        }
      });
    }

    if (min_registrations) {
      (where.AND as Prisma.EventWhereInput[]).push({
        registeredCount: { gte: parseInt(min_registrations) }
      });
    }

    const orderBy: Prisma.EventOrderByWithRelationInput = {};
    switch (sort) {
      case 'date_asc':
        orderBy.startAt = 'asc';
        break;
      case 'date_desc':
        orderBy.startAt = 'desc';
        break;
      case 'price_asc':
        orderBy.price = 'asc';
        break;
      case 'price_desc':
        orderBy.price = 'desc';
        break;
      case 'newest':
        orderBy.createdAt = 'desc';
        break;
      case 'popularity':
        orderBy.registeredCount = 'desc';
        break;
      default:
        orderBy.startAt = 'asc';
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
      orderBy,
    });
  }

  async findAllForAdmin(
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: EventStatus,
  ) {
    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.EventWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { organizer: { profile: { displayName: { contains: search, mode: 'insensitive' } } } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [events, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip,
        take,
        include: {
          organizer: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.event.count({ where }),
    ]);

    return {
      data: events,
      total,
      page,
      limit,
    };
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
      select: {
        id: true,
        status: true,
        createdAt: true,
        phone: true, // Include the phone number
        user: {
          select: {
            email: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
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

    try {
      // Delete dependent records first to avoid FK violations if DB lacks ON DELETE CASCADE
      await this.prisma.$transaction([
        // Clean up possibly unmodeled tables via SQL: delete messages under conversations, then conversations
        this.prisma.$executeRaw`DELETE FROM "messages" WHERE "conversationId" IN (SELECT id FROM "conversations" WHERE "eventId" = ${id})`,
        this.prisma.$executeRaw`DELETE FROM "conversations" WHERE "eventId" = ${id}`,
        this.prisma.registration.deleteMany({ where: { eventId: id } }),
        this.prisma.favorite.deleteMany({ where: { eventId: id } }),
        this.prisma.report.deleteMany({ where: { targetEventId: id } }),
        this.prisma.eventTag.deleteMany({ where: { eventId: id } }),
        this.prisma.eventWaitlist.deleteMany({ where: { eventId: id } }),
        this.prisma.event.delete({ where: { id } }),
      ]);
    } catch (err: any) {
      // Map common Prisma errors to clearer messages
      if (err.code === 'P2003') {
        // Foreign key violation
        throw new ForbiddenException('Không thể xóa sự kiện do còn dữ liệu liên quan.');
      }
      if (err.code === 'P2025') {
        // Record not found
        throw new NotFoundException(`Event with ID "${id}" not found`);
      }
      throw err;
    }

    await this.auditLogsService.log(
      user.id,
      'DELETE_EVENT',
      'Event',
      event.id,
      event,
      null,
    );

    // Controller uses 204 No Content; return void
    return;
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