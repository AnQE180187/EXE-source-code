import {
  Controller,
  Post,
  UseGuards,
  Req,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Get,
  Patch,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User, Role } from '@prisma/client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.transactionsService.findAll();
  }

  @Patch(':id/confirm')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ADMIN)
  manuallyConfirmTransaction(@Param('id') id: string) {
    return this.transactionsService.manuallyConfirmTransaction(id);
  }

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