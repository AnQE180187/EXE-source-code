import { Controller, Post, Body, UseGuards, Req, Delete, Param, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { RegistrationsService } from './registrations.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('events/:eventId/registration')
export class RegistrationsController {
  constructor(private readonly registrationsService: RegistrationsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getRegistrationStatus(
    @Param('eventId') eventId: string,
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.registrationsService.getRegistrationStatus(eventId, user);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Param('eventId') eventId: string,
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.registrationsService.create({ eventId }, user);
  }

  @Post('/confirm-deposit')
  @UseGuards(AuthGuard('jwt'))
  confirmDeposit(
    @Param('eventId') eventId: string,
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.registrationsService.confirmDeposit(eventId, user);
  }

  @Delete()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  remove(@Param('eventId') eventId: string, @Req() req: Request) {
    const user = req.user as User;
    return this.registrationsService.remove(eventId, user);
  }
}
