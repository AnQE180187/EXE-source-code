import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:5173', 'https://freeday.onrender.com'],
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('NotificationsGateway');

  constructor(private configService: ConfigService) {}

  afterInit(server: Server) {
    this.logger.log('Notifications gateway initialized');
  }

  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    const jwtSecret = this.configService.get('JWT_SECRET');
    if (!jwtSecret) {
      client.disconnect();
      throw new Error('JWT_SECRET not set');
    }
    try {
      const payload = jwt.verify(token, jwtSecret) as any;
      const userId = payload.sub;
      if (userId) {
        client.join(userId); // mỗi user một room riêng (userId là khóa chính)
        this.logger.log(`User ${userId} joined notifications channel!`);
      } else {
        client.disconnect();
      }
    } catch (err) {
      client.disconnect();
      this.logger.warn('Unauthorized notifications socket');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected from notifications channel');
  }

  // Dùng trong services:
  sendNotificationToUser(userId: string, notification: any) {
    this.server.to(userId).emit('notification', notification);
  }
}
