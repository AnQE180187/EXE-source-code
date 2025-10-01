import {
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  Body,
  Put,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UsersService } from './users.service';
import { Role, User } from '@prisma/client';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.findAll(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getAllUsers(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.findAll(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getProfile(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.findUserWithProfile(user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER)
  @Get('me/managed-events')
  getMyManagedEvents(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.findMyManagedEvents(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me/my-events')
  getMyActivityEvents(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.findUserActivityEvents(user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('me')
  updateProfile(@Req() req: Request, @Body() updateProfileDto: UpdateProfileDto) {
    const user = req.user as User;
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Post('me/upgrade-to-organizer')
  @UseGuards(AuthGuard('jwt'))
  upgradeToOrganizer(@Req() req: Request) {
    const user = req.user as User;
    return this.usersService.upgradeToOrganizer(user.id);
  }
}
