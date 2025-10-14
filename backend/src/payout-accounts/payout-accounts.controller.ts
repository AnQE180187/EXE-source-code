import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { PayoutAccountsService } from './payout-accounts.service';
import { PayoutAccountDto } from './dto/payout-account.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ORGANIZER)
@Controller('payout-accounts')
export class PayoutAccountsController {
  constructor(private readonly payoutAccountsService: PayoutAccountsService) {}

  @Get('me')
  getPayoutAccount(@Req() req: Request) {
    const user = req.user as User;
    return this.payoutAccountsService.getPayoutAccount(user);
  }

  @Post()
  upsertPayoutAccount(@Req() req: Request, @Body() data: PayoutAccountDto) {
    const user = req.user as User;
    return this.payoutAccountsService.upsertPayoutAccount(user, data);
  }
}
