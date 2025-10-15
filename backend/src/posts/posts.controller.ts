import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role, User } from '@prisma/client';
import { Request } from 'express';
import { PostLikesService } from 'src/post-likes/post-likes.service';
import { OptionalAuthGuard } from 'src/auth/guards/optional-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postLikesService: PostLikesService,
  ) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const user = req.user as User;
    return this.postsService.create(createPostDto, user);
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  findAll(@Query() query: { search?: string, tag?: string, sortBy?: string }, @Req() req: Request) {
    const user = req.user as User | undefined;
    return this.postsService.findAll(query, user?.id);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User | undefined;
    return this.postsService.findOne(id, user?.id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
    const user = req.user as User;
    return this.postsService.update(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.postsService.remove(id, user.id);
  }

  @Post(':id/like')
  @UseGuards(AuthGuard('jwt'))
  toggleLike(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.postLikesService.toggleLike(id, user);
  }
}
