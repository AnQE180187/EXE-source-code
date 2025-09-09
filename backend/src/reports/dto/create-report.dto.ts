import { IsString, IsNotEmpty, IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsOptional()
  @IsUUID()
  @ValidateIf(o => !o.targetPostId && !o.targetCommentId)
  targetEventId?: string;

  @IsOptional()
  @IsUUID()
  @ValidateIf(o => !o.targetEventId && !o.targetCommentId)
  targetPostId?: string;

  @IsOptional()
  @IsUUID()
  @ValidateIf(o => !o.targetEventId && !o.targetPostId)
  targetCommentId?: string;
}
