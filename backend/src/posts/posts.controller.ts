import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const author = req.user as User;
    return this.postsService.create(createPostDto, author);
  }

  @Get()
  findAll(@Query('tag') tag?: string) {
    return this.postsService.findAll({ tag });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
    const user = req.user as User;
    return this.postsService.update(id, updatePostDto, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @Req() req: Request) {
    const user = req.user as User;
    return this.postsService.remove(id, user.id);
  }
}
