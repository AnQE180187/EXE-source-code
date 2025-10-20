import { IsString, IsNotEmpty } from 'class-validator';

export class CreateQueryDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
