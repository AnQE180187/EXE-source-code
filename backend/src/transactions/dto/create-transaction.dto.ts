import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  packageName: string;

  @IsString()
  @IsNotEmpty()
  packagePrice: string;
}
