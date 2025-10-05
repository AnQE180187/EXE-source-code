import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Post('upgrade-organizer')
  @UseGuards(AuthGuard('jwt'))
  createUpgradeTransaction(
    @Req() req: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    const user = req.user as User;
    return this.transactionsService.createUpgradeTransaction(
      user,
      createTransactionDto,
    );
  }

  @Post('casso-webhook')
  @HttpCode(HttpStatus.OK)
  handleCassoWebhook(
    @Headers('secure-token') secureToken: string,
    @Body() payload: any,
  ) {
    return this.transactionsService.handleCassoWebhook(secureToken, payload);
  }
}