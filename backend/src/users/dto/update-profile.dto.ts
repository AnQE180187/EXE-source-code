import { IsString, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(50)
  displayName: string;

  @IsOptional()
  @IsUrl()
  @MaxLength(2048) // Common URL length limit
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;
}
