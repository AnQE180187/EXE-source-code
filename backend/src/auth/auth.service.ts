import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma, User } from '@prisma/client';
import { randomBytes, createHash } from 'crypto';
import { MailService } from 'src/common/mail.service';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async googleLogin(req, res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const { email, firstName, lastName, picture } = req.user;

    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          email,
          provider: 'google',
          profile: {
            create: {
              displayName: `${firstName} ${lastName}`,
              avatarUrl: picture,
            },
          },
        },
        include: { profile: true },
      });
    } else {
      // Update user to set provider to google if they registered with email before
      user = await this.prisma.user.update({
        where: { email },
        data: {
          provider: 'google',
          profile: {
            update: {
              avatarUrl: picture,
            }
          }
        },
        include: { profile: true },
      });
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    // Redirect to frontend with token
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`);
  }

  async register(registerUserDto: RegisterUserDto) {
    const { email, password, displayName, dateOfBirth, gender, city, bio, phone, address } = registerUserDto;

    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        profile: {
          create: {
            displayName: displayName || email,
            gender,
            city,
            bio,
            dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
            phone: phone || null,
            address: address || null,
          },
        },
      },
      include: {
        profile: true, // Include profile in the returned user object
      },
    });

    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile
      }
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    // Trả về message chung, không lộ email có tồn tại hay không
    const genericMessage = { message: 'Nếu email tồn tại, chúng tôi sẽ gửi mã đặt lại mật khẩu tới email của bạn.' };
    if (!user) {
      return genericMessage;
    }

    try {
      // Generate 6-digit OTP
      const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
      const otpHash = createHash('sha256').update(otp).digest('hex');
      const otpExpiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 phút
      const mail = new MailService();
      await mail.sendMail(
        email,
        'Mã xác thực đặt lại mật khẩu',
        `<p> Mã xác thực đặt lại mật khẩu tại FreeDay, mã bao gồm 6 số, mã OTP của bạn là: <b>${otp}</b> (hết hạn sau 10 phút).</p>`
      );
      await this.prisma.passwordReset.create({
        data: {
          userId: user.id,
          otpHash,
          otpExpiresAt,
        },
      });

      // TODO: send OTP via email provider; temp log for dev
      // eslint-disable-next-line no-console
      console.log('Password reset OTP for', email, ':', otp);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('forgotPassword error:', err);
      // Không tiết lộ chi tiết lỗi cho client
    }

    return genericMessage;
  }

  async verifyForgotOtp(email: string, otp: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException('OTP không hợp lệ');
    }

    const otpHash = createHash('sha256').update(otp).digest('hex');
    const record = await this.prisma.passwordReset.findFirst({
      where: { userId: user.id, otpHash, usedAt: null, verifiedAt: null },
      orderBy: { createdAt: 'desc' },
    });
    if (!record) {
      throw new BadRequestException('OTP không hợp lệ');
    }
    if (!record.otpExpiresAt || record.otpExpiresAt < new Date()) {
      throw new BadRequestException('OTP đã hết hạn');
    }

    // Issue a short-lived reset token to proceed to change password
    const tokenRaw = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(tokenRaw).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 phút

    await this.prisma.passwordReset.update({
      where: { id: record.id },
      data: { verifiedAt: new Date(), tokenHash, expiresAt },
    });

    return { token: tokenRaw };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new BadRequestException('Thiếu token hoặc mật khẩu mới');
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const resetRecord = await this.prisma.passwordReset.findUnique({ where: { tokenHash } });
    if (!resetRecord || resetRecord.usedAt) {
      throw new BadRequestException('Token không hợp lệ');
    }
    if (!resetRecord.expiresAt || resetRecord.expiresAt < new Date()) {
      throw new BadRequestException('Token đã hết hạn');
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: resetRecord.userId }, data: { passwordHash } }),
      this.prisma.passwordReset.update({ where: { tokenHash }, data: { usedAt: new Date() } }),
    ]);

    return { message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập.' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // Get the current user
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.passwordHash) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Mật khẩu hiện tại không đúng');
    }

    // Hash the new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update the password
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newPasswordHash }
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}