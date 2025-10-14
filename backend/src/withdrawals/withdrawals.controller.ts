import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { WithdrawalsService } from './withdrawals.service';
import { CreateWithdrawalDto } from './dto/create-withdrawal.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ORGANIZER)
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private readonly withdrawalsService: WithdrawalsService) {}

  @Get()
  getWithdrawalHistory(@Req() req: Request) {
    const user = req.user as User;
    return this.withdrawalsService.getWithdrawalHistory(user);
  }

  @Post()
  createWithdrawalRequest(
    @Req() req: Request,
    @Body() createWithdrawalDto: CreateWithdrawalDto,
  ) {
    const user = req.user as User;
    return this.withdrawalsService.createWithdrawalRequest(user, createWithdrawalDto);
  }
}
