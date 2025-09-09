import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { User, ReportStatus } from '@prisma/client';
export declare class ReportsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createReportDto: CreateReportDto, reporter: User): Promise<{
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
    findAll(status?: ReportStatus): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        status: import(".prisma/client").$Enums.ReportStatus;
        reason: string;
        targetEventId: string | null;
        targetPostId: string | null;
        targetCommentId: string | null;
        note: string | null;
        reporterId: string;
    }[]>;
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
