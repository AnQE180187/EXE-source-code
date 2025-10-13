import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateDepositDto {
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
