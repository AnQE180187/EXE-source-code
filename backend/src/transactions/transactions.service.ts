import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  UnauthorizedException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, TransactionStatus, RegistrationStatus } from '@prisma/client'; // Added RegistrationStatus
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { customAlphabet } from 'nanoid';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionsService {
  private readonly logger = new Logger(TransactionsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private usersService: UsersService, // Inject UsersService
    private readonly httpService: HttpService,
  ) { }

  async findAll() {
    return this.prisma.transaction.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          include: {
            profile: true,
          },
        },
        registration: {
          include: {
            event: {
              include: {
                organizer: {
                  include: {
                    profile: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async getTransactionStatusByOrderCode(orderCode: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { orderCode },
      select: { status: true },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction with order code ${orderCode} not found.`);
    }

    return transaction;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleExpiredPendingTransactions() {
    this.logger.log('Running job to clean up expired pending transactions...');
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    const expiredTransactions = await this.prisma.transaction.findMany({
      where: {
        status: TransactionStatus.PENDING,
        createdAt: {
          lt: tenMinutesAgo,
        },
      },
    });

    if (expiredTransactions.length === 0) {
      this.logger.log('No expired pending transactions found.');
      return;
    }

    this.logger.log(`Found ${expiredTransactions.length} expired transactions to clean up.`);

    const expiredTransactionIds = expiredTransactions.map((t) => t.id);

    try {
      await this.prisma.$transaction(async (tx) => {
        // Delete associated pending registrations first
        const deletedRegs = await tx.registration.deleteMany({
          where: {
            transactionId: {
              in: expiredTransactionIds,
            },
            status: RegistrationStatus.PENDING,
          },
        });

        this.logger.log(`Deleted ${deletedRegs.count} associated pending registrations.`);

        // Then delete the expired transactions
        const deletedTxs = await tx.transaction.deleteMany({
          where: {
            id: {
              in: expiredTransactionIds,
            },
          },
        });

        this.logger.log(`Successfully deleted ${deletedTxs.count} expired transactions.`);
      });
    } catch (error) {
      this.logger.error('Error cleaning up expired transactions:', error.stack);
    }
  }

  async manuallyConfirmTransaction(transactionId: string) {
    const pendingTx = await this.prisma.transaction.findFirst({
      where: {
        id: transactionId,
        status: TransactionStatus.PENDING,
      },
    });

    if (!pendingTx) {
      throw new NotFoundException(
        `Pending transaction with ID ${transactionId} not found.`,
      );
    }

    this.logger.log(
      `Manually processing transaction for order code: ${pendingTx.orderCode}`,
    );
    try {
      await this.prisma.$transaction(async (tx) => {
        // 1. Upgrade user role
        await this.usersService.upgradeToOrganizer(pendingTx.userId, tx as any);

        // 2. Update our transaction status to COMPLETED
        await tx.transaction.update({
          where: { id: pendingTx.id },
          data: { status: TransactionStatus.COMPLETED },
        });
      });
      this.logger.log(
        `Successfully processed and completed order: ${pendingTx.orderCode}`,
      );
      return { message: 'Transaction confirmed successfully' };
    } catch (error) {
      this.logger.error(
        `Failed to process transaction ${pendingTx.id} for order ${pendingTx.orderCode}`,
        error.stack,
      );
      // Optionally, update transaction to FAILED
      await this.prisma.transaction.update({
        where: { id: pendingTx.id },
        data: { status: TransactionStatus.FAILED },
      });
      throw new InternalServerErrorException('Failed to confirm transaction.');
    }
  }

  // ... existing createUpgradeTransaction method
  async createDepositTransaction(
    user: User,
    eventId: string,
    amount: number,
  ) {
    // Generate a unique order code for deposit
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
    const orderCode = `DEP${nanoid()}`;

    // Create a pending transaction in the database
    const transaction = await this.prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        description: `Deposit for event ${eventId}`,
        orderCode,
        status: 'PENDING',
      },
    });

    return transaction;
  }

  async createUpgradeTransaction(
    user: User,
    createTransactionDto: CreateTransactionDto,
  ) {
    const accountName = this.configService.get<string>('VIETQR_ACCOUNT_NAME');
    const accountNumber = this.configService.get<string>(
      'VIETQR_ACCOUNT_NUMBER',
    );
    const bankBin = this.configService.get<string>('VIETQR_BANK_BIN');

    if (!accountName || !accountNumber || !bankBin) {
      throw new InternalServerErrorException(
        'VietQR payment settings are not configured on the server.',
      );
    }

    const { packageName, packagePrice } = createTransactionDto;

    const amount = parseFloat(packagePrice.replace(/\./g, ''));
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Invalid package price');
    }

    // Generate a unique order code
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 8);
    const orderCode = `UPG${nanoid()}`;

    // Create a pending transaction in the database
    await this.prisma.transaction.create({
      data: {
        userId: user.id,
        amount,
        description: `Upgrade to ${packageName} for user ${user.email}`,
        orderCode,
        status: 'PENDING',
      },
    });

    // Return details needed for VietQR generation
    return {
      amount,
      accountName,
      accountNumber,
      bankBin,
      template: 'compact',
      description: orderCode, // The QR description should be the order code for easy lookup
    };
  }

  // ... existing handleCassoWebhook method
  async handleCassoWebhook(secureToken: string, payload: any) {
    const webhookSecret = this.configService.get<string>('CASSO_WEBHOOK_SECRET');
    if (secureToken !== webhookSecret) {
      throw new UnauthorizedException('Invalid secure token');
    }

    // When creating a webhook, Casso sends a test payload with an empty body.
    if (!payload || !payload.data) {
      this.logger.log('Received a test or empty webhook from Casso.');
      return { success: true };
    }

    this.logger.log(`Received webhook with ${payload.data.length} transactions.`);
    for (const cassoTx of payload.data) {
      await this.processCassoTransaction(cassoTx);
    }

    return { success: true };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCassoSync() {
    this.logger.log('Running scheduled job to sync transactions from Casso...');
    const apiKey = this.configService.get<string>('CASSO_API_KEY');
    if (!apiKey) {
      this.logger.warn('CASSO_API_KEY is not configured. Skipping sync job.');
      return;
    }

    try {
      const url = 'https://oauth.casso.vn/v2/transactions';
      const headers = { Authorization: `Apikey ${apiKey}` };
      // Fetch transactions from the last 24 hours to be safe
      const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];

      const { data } = await firstValueFrom(
        this.httpService.get(url, { headers, params: { fromDate, pageSize: 100 } }),
      );

      // Defensive check: Ensure data.data.records is an array before iterating
      if (data && data.data && Array.isArray(data.data.records)) {
        this.logger.log(`Fetched ${data.data.records.length} transactions from Casso API.`);
        // Reverse the array to process the newest transactions first
        const reversedTransactions = data.data.records.reverse();
        for (const cassoTx of reversedTransactions) {
          await this.processCassoTransaction(cassoTx);
        }
      } else {
        // Log a warning if the structure is not as expected (e.g., an error response from Casso)
        this.logger.warn(
          `Received unexpected data structure from Casso API: ${JSON.stringify(data)}`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to sync transactions from Casso', error.stack);
    }
  }

  private async processCassoTransaction(cassoTx: any) {
    const description = cassoTx.description;
    const amount = cassoTx.amount;

    // Look for either UPG (Upgrade) or DEP (Deposit) prefixes
    const orderCodeMatch = description.match(/(UPG|DEP)[A-Z0-9]{8}/);
    if (!orderCodeMatch) {
      return; // Not a transaction we are interested in, skip
    }
    const orderCode = orderCodeMatch[0];

    const pendingTx = await this.prisma.transaction.findFirst({
      where: {
        orderCode: orderCode,
        status: TransactionStatus.PENDING,
      },
    });

    // Only process if we find a corresponding PENDING transaction and the amount is sufficient
    if (pendingTx && amount >= pendingTx.amount) {
      this.logger.log(`Processing matched transaction for order code: ${orderCode}`);
      try {
        // Use a Prisma transaction to ensure atomicity
        await this.prisma.$transaction(async (tx) => {
          // Logic for User Upgrade
          if (orderCode.startsWith('UPG')) {
            await this.usersService.upgradeToOrganizer(pendingTx.userId, tx as any);
          }
          // Logic for Event Deposit
          else if (orderCode.startsWith('DEP')) {
            const registration = await tx.registration.findFirst({
              where: { transactionId: pendingTx.id },
              include: { event: true }, // Include event to get organizerId
            });

            if (!registration) {
              throw new InternalServerErrorException(
                `Registration for transaction ${pendingTx.id} not found.`
              );
            }

            // Update registration status to DEPOSITED
            await tx.registration.update({
              where: { id: registration.id },
              data: { status: RegistrationStatus.DEPOSITED },
            });

            // Increment the event's registered count
            await tx.event.update({
              where: { id: registration.eventId },
              data: { registeredCount: { increment: 1 } },
            });

            // Credit the organizer's wallet
            const organizerId = registration.event.organizerId;
            await tx.wallet.upsert({
              where: { userId: organizerId },
              create: {
                userId: organizerId,
                balance: pendingTx.amount,
              },
              update: {
                balance: { increment: pendingTx.amount },
              },
            });

            this.logger.log(`Credited ${pendingTx.amount} to wallet of organizer ${organizerId}`);
          }

          // Mark the transaction as completed
          await tx.transaction.update({
            where: { id: pendingTx.id },
            data: { status: TransactionStatus.COMPLETED },
          });
        });

        this.logger.log(`Successfully processed and completed order: ${orderCode}`);
      } catch (error) {
        this.logger.error(
          `Failed to process transaction ${pendingTx.id} for order ${orderCode}`,
          error.stack,
        );
        // Optionally, update transaction to FAILED
        await this.prisma.transaction.update({
          where: { id: pendingTx.id },
          data: { status: TransactionStatus.FAILED },
        });
      }
    }
  }
}

