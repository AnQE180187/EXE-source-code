import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, displayName, dateOfBirth, ...restProfileData } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Safely construct profile data
    const profileCreateData: Prisma.ProfileCreateWithoutUserInput = {
        displayName: displayName || email, // Fallback to email if no displayName
        ...restProfileData,
    };

    // Only add dateOfBirth if it's a valid, non-empty string
    if (dateOfBirth && dateOfBirth.length > 0) {
        profileCreateData.dateOfBirth = new Date(dateOfBirth);
    }

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: profileCreateData,
        },
      },
      include: {
        profile: true, // Include profile in the returned user object
      },
    });

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async validateUser(payload: any) {
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      throw new UnauthorizedException();
    }
    // You might want to return a subset of the user object
    const { passwordHash, ...result } = user;
    return result;
  }
}