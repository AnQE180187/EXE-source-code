import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  async getConversations(@Request() req) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('messages/:conversationId')
  async getMessages(@Param('conversationId') conversationId: string) {
    return this.chatService.getMessages(conversationId);
  }

  @Post('messages')
  async createMessage(@Request() req, @Body() body: { conversationId: string, content: string }) {
    return this.chatService.createMessage(body.conversationId, req.user.id, body.content);
  }

  @Post('conversations/find-or-create')
  async findOrCreateConversation(
    @Request() req,
    @Body() body: { eventId: string; participantId: string; organizerId: string },
  ) {
    return this.chatService.findOrCreateConversation(
      body.eventId,
      body.participantId,
      body.organizerId,
    );
  }
}
