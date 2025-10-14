import { IsString, IsNotEmpty, IsDateString, IsOptional, IsInt, IsNumber, Min, Max, IsArray, IsUrl } from 'class-validator';
import { EventStatus } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  locationText: string;

  @IsDateString()
  startAt: string;

  @IsDateString()
  endAt: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  status?: EventStatus;

  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  // Optional coordinates for map display
  @IsNumber()
  @IsOptional()
  @Min(-90)
  @Max(90)
  lat?: number;

  @IsNumber()
  @IsOptional()
  @Min(-180)
  @Max(180)
  lng?: number;
}
