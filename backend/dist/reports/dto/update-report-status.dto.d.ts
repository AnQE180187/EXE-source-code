import { ReportStatus } from '@prisma/client';
export declare class UpdateReportStatusDto {
    status: ReportStatus;
    note?: string;
}
