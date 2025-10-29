import { Controller, Get, Patch, Param, Query, UseGuards, Body, Req, ParseIntPipe, DefaultValuePipe, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, WithdrawalStatus, AccountStatus, EventStatus, VisibilityStatus } from '@prisma/client';
import { AdminService } from './admin.service';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/revenue-chart')
  getRevenueChartData(@Query('period') period: '7d' | '30d' | '12m') {
    return this.adminService.getRevenueChartData(period || '30d');
  }

  @Get('users')
  getUsers(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('role') role?: Role,
    @Query('status') status?: AccountStatus,
  ) {
    return this.adminService.getUsers(page, limit, search, role, status);
  }

  @Get('events')
  getEvents(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: EventStatus,
  ) {
    return this.adminService.getEvents(page, limit, search, status);
  }

  @Get('posts')
  getPosts(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('status') status?: VisibilityStatus,
  ) {
    return this.adminService.getPosts(page, limit, search, status);
  }

  @Patch('users/:id/role')
  updateUserRole(
    @Param('id') id: string,
    @Body('role') role: Role,
    @Req() req: any,
  ) {
    return this.adminService.updateUserRole(id, role, req.user.id);
  }

  @Patch('users/:id/status')
  updateUserStatus(
    @Param('id') id: string,
    @Body('status') status: AccountStatus,
    @Req() req: any,
  ) {
    return this.adminService.updateUserStatus(id, status, req.user.id);
  }

  @Patch('events/:id/status')
  updateEventStatus(
    @Param('id') id: string,
    @Body('status') status: EventStatus,
    @Req() req: any,
  ) {
    return this.adminService.updateEventStatus(id, status, req.user.id);
  }

  @Patch('posts/:id/status')
  updatePostStatus(
    @Param('id') id: string,
    @Body('status') status: VisibilityStatus,
    @Req() req: any,
  ) {
    return this.adminService.updatePostStatus(id, status, req.user.id);
  }

  @Delete('posts/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id') id: string, @Req() req: any) {
    return this.adminService.deletePost(id, req.user.id);
  }

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
