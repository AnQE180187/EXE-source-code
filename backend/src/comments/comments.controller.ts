import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('postId') postId: string,
    @Body() createCommentDto: Omit<CreateCommentDto, 'postId'>,
    @Req() req: Request,
  ) {
    const author = req.user as User;
    const fullDto: CreateCommentDto = { ...createCommentDto, postId };
    return this.commentsService.create(fullDto, author);
  }

  @Get()
  findAllByPost(@Param('postId') postId: string) {
    return this.commentsService.findAllByPost(postId);
  }

  @Get(':commentId')
  findOne(@Param('commentId') commentId: string) {
    return this.commentsService.findOne(commentId);
  }

  @Patch(':commentId')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.commentsService.update(commentId, updateCommentDto, user.id);
  }

  @Delete(':commentId')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('commentId') commentId: string, @Req() req: Request) {
    const user = req.user as User;
    return this.commentsService.remove(commentId, user.id);
  }
}
