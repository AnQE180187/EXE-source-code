import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get('me')
  async getMyNotifications(@Req() req) {
    return this.notificationsService.getUserNotifications(req.user.id || req.user.userId);
  }

  @Patch('me/read')
  async markAllRead(@Req() req) {
    return this.notificationsService.markAllAsRead(req.user.id || req.user.userId);
  }
}
