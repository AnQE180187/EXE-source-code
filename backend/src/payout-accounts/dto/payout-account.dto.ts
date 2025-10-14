import { IsString, IsNotEmpty, IsCreditCard } from 'class-validator';

export class PayoutAccountDto {
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountName: string;

  @IsString() // Using IsString for flexibility, can be changed to a more specific validator if needed
  @IsNotEmpty()
  accountNumber: string;
}
