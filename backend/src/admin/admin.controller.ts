import { Controller, Get, Patch, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, WithdrawalStatus } from '@prisma/client';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('withdrawals')
  getWithdrawals(@Query('status') status?: WithdrawalStatus) {
    return this.adminService.getWithdrawals(status);
  }

  @Patch('withdrawals/:id/approve')
  approveWithdrawal(@Param('id') id: string) {
    return this.adminService.approveWithdrawal(id);
  }

  @Patch('withdrawals/:id/reject')
  rejectWithdrawal(@Param('id') id: string) {
    return this.adminService.rejectWithdrawal(id);
  }

  @Get('wallets')
  getAllWallets() {
    return this.adminService.getAllWallets();
  }
}
