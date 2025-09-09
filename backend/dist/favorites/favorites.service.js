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
exports.FavoritesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FavoritesService = class FavoritesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async toggleFavorite(eventId, userId) {
        return this.prisma.$transaction(async (tx) => {
            const event = await tx.event.findUnique({ where: { id: eventId } });
            if (!event) {
                throw new common_1.NotFoundException(`Event with ID "${eventId}" not found`);
            }
            const existingFavorite = await tx.favorite.findUnique({
                where: { userId_eventId: { userId, eventId } },
            });
            if (existingFavorite) {
                await tx.favorite.delete({
                    where: { userId_eventId: { userId, eventId } },
                });
                await tx.event.update({
                    where: { id: eventId },
                    data: { favoritesCount: { decrement: 1 } },
                });
                return { favorited: false };
            }
            else {
                await tx.favorite.create({
                    data: { userId, eventId },
                });
                await tx.event.update({
                    where: { id: eventId },
                    data: { favoritesCount: { increment: 1 } },
                });
                return { favorited: true };
            }
        });
    }
};
exports.FavoritesService = FavoritesService;
exports.FavoritesService = FavoritesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FavoritesService);
//# sourceMappingURL=favorites.service.js.map