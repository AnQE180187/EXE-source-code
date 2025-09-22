import { Controller, Post, Body, UseGuards, Req, Get, Param, Patch, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { UpdateEventStatusDto } from './dto/update-event-status.dto'; // Import new DTO
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { FavoritesService } from 'src/favorites/favorites.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER)
  create(@Body() createEventDto: CreateEventDto, @Req() req: Request) {
    const organizer = req.user as User;
    return this.eventsService.create(createEventDto, organizer);
  }

  @Get()
  findAll(@Query() query: { search?: string; price?: string }) {
    return this.eventsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Get(':id/registrations')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  getRegistrations(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.eventsService.getRegistrationsForEvent(id, user);
  }

  @Post(':id/favorite')
  @UseGuards(AuthGuard('jwt'))
  toggleFavorite(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.favoritesService.toggleFavorite(id, user.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.eventsService.update(id, updateEventDto, user);
  }

  // New dedicated endpoint for status change
  @Patch(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body() updateEventStatusDto: UpdateEventStatusDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.eventsService.updateStatus(id, updateEventStatusDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.ORGANIZER, Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.eventsService.remove(id, user);
  }
}
