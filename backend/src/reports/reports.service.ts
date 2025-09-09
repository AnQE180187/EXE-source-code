import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportStatusDto } from './dto/update-report-status.dto';
import { User, ReportStatus } from '@prisma/client';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto, reporter: User) {
    const { targetEventId, targetPostId, targetCommentId } = createReportDto;

    // Ensure only one target is provided
    const targetCount = [targetEventId, targetPostId, targetCommentId].filter(Boolean).length;
    if (targetCount !== 1) {
      throw new BadRequestException('Exactly one target (event, post, or comment) must be provided');
    }

    return this.prisma.report.create({
      data: {
        ...createReportDto,
        reporterId: reporter.id,
      },
    });
  }

  findAll(status?: ReportStatus) {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }
    return report;
  }

  async updateStatus(id: string, updateDto: UpdateReportStatusDto) {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found`);
    }

    return this.prisma.report.update({
      where: { id },
      data: updateDto,
    });
  }
}
