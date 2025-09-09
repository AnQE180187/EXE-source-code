import { IsUUID } from 'class-validator';

export class CreateRegistrationDto {
  @IsUUID()
  eventId: string;
}
