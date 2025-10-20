import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatbotService } from './chatbot.service';
import { CreateQueryDto } from './dto/create-query.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('query')
  createQuery(@Body() createQueryDto: CreateQueryDto) {
    return this.chatbotService.generateResponse(createQueryDto.message);
  }
}
