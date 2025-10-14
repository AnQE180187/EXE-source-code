import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async findOrCreateWalletForUser(user: User) {
    let wallet = await this.prisma.wallet.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      wallet = await this.prisma.wallet.create({
        data: {
          userId: user.id,
          balance: 0,
        },
      });
    }

    return wallet;
  }
}
