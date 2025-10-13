import { Module } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  providers: [RegistrationsService],
  exports: [RegistrationsService] // Export the service so other modules can use it
})
export class RegistrationsModule {}
