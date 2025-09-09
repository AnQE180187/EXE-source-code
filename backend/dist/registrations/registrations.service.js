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
exports.RegistrationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let RegistrationsService = class RegistrationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createRegistrationDto, user) {
        const { eventId } = createRegistrationDto;
        return this.prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({
                where: { id: eventId },
            });
            if (!event) {
                throw new common_1.NotFoundException(`Event with ID "${eventId}" not found`);
            }
            if (event.status !== client_1.EventStatus.PUBLISHED) {
                throw new common_1.BadRequestException('Event is not published');
            }
            if (event.registeredCount >= event.capacity) {
                throw new common_1.BadRequestException('Event is full');
            }
            const existingRegistration = await tx.registration.findUnique({
                where: { eventId_userId: { eventId, userId: user.id } },
            });
            if (existingRegistration) {
                throw new common_1.ConflictException('User already registered for this event');
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
    async remove(eventId, user) {
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
                throw new common_1.NotFoundException(`Registration for event with ID "${eventId}" not found for this user`);
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
};
exports.RegistrationsService = RegistrationsService;
exports.RegistrationsService = RegistrationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RegistrationsService);
//# sourceMappingURL=registrations.service.js.map