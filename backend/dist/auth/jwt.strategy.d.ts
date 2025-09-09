import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: {
        sub: string;
        email: string;
    }): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        provider: string;
        providerId: string | null;
        role: import(".prisma/client").$Enums.Role;
        status: import(".prisma/client").$Enums.AccountStatus;
        updatedAt: Date;
    }>;
}
export {};
