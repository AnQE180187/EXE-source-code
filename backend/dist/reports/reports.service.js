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
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ReportsService = class ReportsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createReportDto, reporter) {
        const { targetEventId, targetPostId, targetCommentId } = createReportDto;
        const targetCount = [targetEventId, targetPostId, targetCommentId].filter(Boolean).length;
        if (targetCount !== 1) {
            throw new common_1.BadRequestException('Exactly one target (event, post, or comment) must be provided');
        }
        return this.prisma.report.create({
            data: {
                ...createReportDto,
                reporterId: reporter.id,
            },
        });
    }
    findAll(status) {
        return this.prisma.report.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const report = await this.prisma.report.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID "${id}" not found`);
        }
        return report;
    }
    async updateStatus(id, updateDto) {
        const report = await this.prisma.report.findUnique({ where: { id } });
        if (!report) {
            throw new common_1.NotFoundException(`Report with ID "${id}" not found`);
        }
        return this.prisma.report.update({
            where: { id },
            data: updateDto,
        });
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map