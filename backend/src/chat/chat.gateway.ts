import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { Logger, UseGuards } from '@nestjs/common';
import { WsGuard } from '../auth/guards/ws.guard';

@WebSocketGateway({
  cors: {
    origin: ['https://freeday.onrender.com', 'http://localhost:5173'],
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  constructor(private readonly chatService: ChatService) {}

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string) {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('message.send')
  async handleMessage(
    client: Socket,
    payload: { conversationId: string; content: string },
  ) {
    this.logger.log(`Message received: ${JSON.stringify(payload)}`);
    try {
      const user = client.handshake.auth.user;
      const message = await this.chatService.createMessage(
        payload.conversationId,
        user.id,
        payload.content,
      );
      this.server
        .to(payload.conversationId)
        .emit('message.receive', message);
    } catch (error) {
      this.logger.error(`Error creating message: ${error.message}`);
    }
  }
}
