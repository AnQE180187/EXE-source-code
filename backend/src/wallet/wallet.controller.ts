import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { WalletService } from './wallet.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ORGANIZER)
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('me')
  getWallet(@Req() req: Request) {
    const user = req.user as User;
    return this.walletService.findOrCreateWalletForUser(user);
  }
}
