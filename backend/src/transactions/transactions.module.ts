import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [UsersModule, HttpModule], // Import UsersModule and HttpModule here
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
