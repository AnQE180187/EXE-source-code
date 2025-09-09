import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ReportStatus } from '@prisma/client';
import { IsOptional } from 'class-validator';


export class UpdateReportStatusDto {
  @IsEnum(ReportStatus)
  @IsNotEmpty()
  status: ReportStatus;

  @IsOptional()
  @IsString()
  note?: string;
}
