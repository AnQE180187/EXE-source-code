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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_logs_service_1 = require("../audit-logs/audit-logs.service");
let UsersService = class UsersService {
    prisma;
    auditLogsService;
    constructor(prisma, auditLogsService) {
        this.prisma = prisma;
        this.auditLogsService = auditLogsService;
    }
    async findUserWithProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                profile: true,
            },
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found`);
        }
        return user;
    }
    async findMyEvents(userId) {
        const registeredEvents = this.prisma.registration.findMany({
            where: { userId },
            include: { event: true },
        });
        const favoritedEvents = this.prisma.favorite.findMany({
            where: { userId },
            include: { event: true },
        });
        const [registered, favorited] = await Promise.all([
            registeredEvents,
            favoritedEvents,
        ]);
        return {
            registeredEvents: registered.map((r) => r.event),
            favoritedEvents: favorited.map((f) => f.event),
        };
    }
    async updateProfile(userId, updateProfileDto) {
        const oldProfile = await this.prisma.profile.findUnique({ where: { userId } });
        const updatedProfile = await this.prisma.profile.upsert({
            where: { userId },
            update: updateProfileDto,
            create: {
                userId,
                ...updateProfileDto,
            },
        });
        await this.auditLogsService.log(userId, 'UPDATE_PROFILE', 'Profile', userId, oldProfile, updatedProfile);
        return updatedProfile;
    }
    async upgradeToOrganizer(userId) {
        const oldUser = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, role: true },
        });
        if (!oldUser) {
            throw new common_1.NotFoundException(`User with ID "${userId}" not found`);
        }
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: { role: client_1.Role.ORGANIZER },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        await this.auditLogsService.log(userId, 'UPGRADE_ROLE', 'User', userId, { role: oldUser.role }, { role: updatedUser.role });
        return updatedUser;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_logs_service_1.AuditLogsService])
], UsersService);
//# sourceMappingURL=users.service.js.map