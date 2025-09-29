import { IsEmail, IsString, MinLength, IsOptional, IsDateString, Matches } from 'class-validator';

export class RegisterUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @Matches(/^[0-9]{10}$/, { message: 'Phone number must be exactly 10 digits' })
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
