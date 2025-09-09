import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { AuditLogsService } from 'src/audit-logs/audit-logs.service';
export declare class AuthService {
    private prisma;
    private jwtService;
    private auditLogsService;
    constructor(prisma: PrismaService, jwtService: JwtService, auditLogsService: AuditLogsService);
    register(registerUserDto: RegisterUserDto): Promise<{
        accessToken: string;
    }>;
    login(loginUserDto: LoginUserDto): Promise<{
        accessToken: string;
    }>;
}
