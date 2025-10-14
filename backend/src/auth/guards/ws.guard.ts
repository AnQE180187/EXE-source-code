import { CanActivate, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';

@Injectable()
export class WsGuard implements CanActivate {
  private logger: Logger = new Logger(WsGuard.name);

  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization?.split(' ')[1] ||
      context.args[0].handshake.auth.token;

    if (!bearerToken) {
      this.logger.error('No token found');
      return false;
    }

    try {
      const decoded = this.jwtService.verify(bearerToken) as any;
      return new Promise((resolve, reject) => {
        return this.authService.validateUser({ sub: decoded.sub }).then((user) => {
          if (user) {
            context.args[0].handshake.auth.user = user;
            resolve(true);
          } else {
            reject(false);
          }
        });
      });
    } catch (ex) {
      this.logger.error(ex.message);
      return false;
    }
  }
}
