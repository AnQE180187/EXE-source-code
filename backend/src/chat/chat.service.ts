import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async getConversations(userId: string) {
    return this.prisma.conversation.findMany({
      where: {
        OR: [{ participantId: userId }, { organizerId: userId }],
      },
      include: {
        participant: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        organizer: {
          select: {
            id: true,
            profile: {
              select: {
                displayName: true,
                avatarUrl: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async getMessages(conversationId: string) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async createMessage(
    conversationId: string,
    senderId: string,
    content: string,
  ) {
    return this.prisma.message.create({
      data: {
        conversationId,
        senderId,
        content,
      },
    });
  }

  async findOrCreateConversation(
    eventId: string,
    participantId: string,
    organizerId: string,
  ) {
    let conversation = await this.prisma.conversation.findUnique({
      where: {
        eventId_participantId_organizerId: {
          eventId,
          participantId,
          organizerId,
        },
      },
    });

    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: {
          eventId,
          participantId,
          organizerId,
        },
      });
    }

    return conversation;
  }
}
