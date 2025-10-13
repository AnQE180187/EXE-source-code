import { BadRequestException, ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { User, EventStatus, RegistrationStatus } from '@prisma/client';
import { TransactionsService } from 'src/transactions/transactions.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RegistrationsService {
  constructor(
    private prisma: PrismaService,
    private transactionsService: TransactionsService,
    private configService: ConfigService,
  ) { }

  async getRegistrationStatus(eventId: string, user: User) {
    const registration = await this.prisma.registration.findUnique({
      where: { eventId_userId: { eventId, userId: user.id } },
      select: { status: true, createdAt: true }
    });

    return {
      isRegistered: !!registration,
      status: registration?.status || null,
      registeredAt: registration?.createdAt || null
    };
  }

  async initiateDeposit(eventId: string, user: User, phone: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID "${eventId}" not found`);
    }
    // Add a check to ensure the price is not null before using it
    if (event.status !== EventStatus.PUBLISHED) {
      throw new BadRequestException('Event is not published');
    }
    if (event.price === null || event.price <= 0) {
      throw new BadRequestException('This event is not a paid event or has no price.');
    }
    if (event.registeredCount >= event.capacity) {
      throw new BadRequestException('Event is full');
    }

    const existingRegistration = await this.prisma.registration.findFirst({
      where: {
        eventId: eventId,
        userId: user.id,
        status: { in: [RegistrationStatus.REGISTERED, RegistrationStatus.DEPOSITED] }
      },
    });

    if (existingRegistration) {
      throw new ConflictException('User already registered for this event');
    }

    const transaction = await this.prisma.$transaction(async (tx) => {
      // 1. Create a pending transaction
      const pendingTransaction = await this.transactionsService.createDepositTransaction(
        user,
        eventId,
        event.price as number,
      );

      // 2. Create a pending registration linked to the transaction
      await tx.registration.create({
        data: {
          eventId: eventId,
          userId: user.id,
          status: RegistrationStatus.PENDING, // Pending payment
          phone: phone,
          transactionId: pendingTransaction.id,
        },
      });

      return pendingTransaction;
    });

    // 3. Return details for QR code generation
    const accountName = this.configService.get<string>('VIETQR_ACCOUNT_NAME');
    const accountNumber = this.configService.get<string>('VIETQR_ACCOUNT_NUMBER');
    const bankBin = this.configService.get<string>('VIETQR_BANK_BIN');

    if (!accountName || !accountNumber || !bankBin) {
      throw new InternalServerErrorException(
        'VietQR payment settings are not configured on the server.',
      );
    }

    return {
      amount: transaction.amount,
      accountName,
      accountNumber,
      bankBin,
      template: 'compact',
      description: transaction.orderCode,
    };
  }

  async create(createRegistrationDto: CreateRegistrationDto, user: User) {
    const { eventId } = createRegistrationDto;

    return this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new NotFoundException(`Event with ID "${eventId}" not found`);
      }
      if (event.status !== EventStatus.PUBLISHED) {
        throw new BadRequestException('Event is not published');
      }
      if (event.registeredCount >= event.capacity) {
        throw new BadRequestException('Event is full');
      }

      const existingRegistration = await tx.registration.findUnique({
        where: { eventId_userId: { eventId, userId: user.id } },
      });

      if (existingRegistration) {
        throw new ConflictException('User already registered for this event');
      }

      const registration = await tx.registration.create({
        data: { eventId, userId: user.id },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { registeredCount: { increment: 1 } },
      });

      return registration;
    });
  }

  async confirmDeposit(eventId: string, user: User) {
    const registration = await this.prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId: eventId,
          userId: user.id,
        },
      },
    });

    if (!registration) {
      throw new NotFoundException(`Registration for event with ID "${eventId}" not found.`);
    }

    if (registration.status === RegistrationStatus.DEPOSITED) {
      throw new ConflictException('Deposit has already been confirmed for this registration.');
    }

    return this.prisma.registration.update({
      where: {
        id: registration.id,
      },
      data: {
        status: RegistrationStatus.DEPOSITED,
      },
    });
  }

  async remove(eventId: string, user: User) {
    return this.prisma.$transaction(async (tx) => {
      const registration = await tx.registration.findUnique({
        where: {
          eventId_userId: {
            eventId: eventId,
            userId: user.id,
          },
        },
      });

      if (!registration) {
        throw new NotFoundException(
          `Registration for event with ID "${eventId}" not found for this user`,
        );
      }

      await tx.registration.delete({
        where: {
          eventId_userId: {
            eventId: eventId,
            userId: user.id,
          },
        },
      });

      await tx.event.update({
        where: { id: registration.eventId },
        data: { registeredCount: { decrement: 1 } },
      });

      return { message: 'Registration cancelled successfully' };
    });
  }
}