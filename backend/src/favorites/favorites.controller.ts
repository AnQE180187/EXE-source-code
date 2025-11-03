import { Controller, Post, Get, Param, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('events/:eventId/favorite')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  toggle(@Param('eventId') eventId: string, @Req() req: Request) {
    const user = req.user as User;
    return this.favoritesService.toggleFavorite(eventId, user); // truyền object user
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getStatus(@Param('eventId') eventId: string, @Req() req: Request) {
    const user = req.user as User;
    return this.favoritesService.getFavoriteStatus(eventId, user.id);
  }
}
