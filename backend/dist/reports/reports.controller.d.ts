import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { ReportStatus } from '@prisma/client';
import { Request } from 'express';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(createReportDto: CreateReportDto, req: Request): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        reason: string;
        targetEventId: string | null;
        targetPostId: string | null;
        targetCommentId: string | null;
        note: string | null;
        reporterId: string;
    }>;
    findAll(req: Request, status?: ReportStatus): import(".prisma/client").Prisma.PrismaPromise<({
        reporter: {
            profile: {
                displayName: string;
                avatarUrl: string | null;
                city: string | null;
                bio: string | null;
                interests: import("@prisma/client/runtime/library").JsonValue | null;
                userId: string;
            } | null;
            email: string;
            id: string;
        };
    } & {
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        reason: string;
        targetEventId: string | null;
        targetPostId: string | null;
        targetCommentId: string | null;
        note: string | null;
        reporterId: string;
    })[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        reason: string;
        targetEventId: string | null;
        targetPostId: string | null;
        targetCommentId: string | null;
        note: string | null;
        reporterId: string;
    }>;
    updateStatus(id: string, updateDto: UpdateReportStatusDto): Promise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        reason: string;
        targetEventId: string | null;
        targetPostId: string | null;
        targetCommentId: string | null;
        note: string | null;
        reporterId: string;
    }>;
}
