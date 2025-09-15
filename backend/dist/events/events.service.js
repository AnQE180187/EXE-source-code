"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let EventsService = class EventsService {
    prisma;
    auditLogsService;
    constructor(prisma, auditLogsService) {
        this.prisma = prisma;
        this.auditLogsService = auditLogsService;
    }
    create(createEventDto, organizer) {
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
                    { status: client_1.EventStatus.PUBLISHED },
                    { status: client_1.EventStatus.CLOSED }
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
    async findOne(id) {
        const event = await this.prisma.event.findUnique({
            where: { id },
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID "${id}" not found`);
        }
        return event;
    }
    async update(id, updateEventDto, user) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID "${id}" not found`);
        }
        if (event.organizerId !== user.id && user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You are not authorized to update this event');
        }
        const updatedEvent = await this.prisma.event.update({
            where: { id },
            data: {
                ...updateEventDto,
                startAt: updateEventDto.startAt ? new Date(updateEventDto.startAt) : undefined,
                endAt: updateEventDto.endAt ? new Date(updateEventDto.endAt) : undefined,
            },
        });
        await this.auditLogsService.log(user.id, 'UPDATE_EVENT', 'Event', event.id, event, updatedEvent);
        return updatedEvent;
    }
    async remove(id, user) {
        const event = await this.prisma.event.findUnique({ where: { id } });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID "${id}" not found`);
        }
        if (event.organizerId !== user.id && user.role !== client_1.Role.ADMIN) {
            throw new common_1.ForbiddenException('You are not authorized to delete this event');
        }
        await this.prisma.event.delete({ where: { id } });
        await this.auditLogsService.log(user.id, 'DELETE_EVENT', 'Event', event.id, event, null);
        return { message: 'Event deleted successfully' };
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService])
], EventsService);
//# sourceMappingURL=events.service.js.map