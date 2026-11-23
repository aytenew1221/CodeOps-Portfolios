import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (
      typeof authorization !== 'string' ||
      !authorization.startsWith('Bearer ')
    ) {
      throw new UnauthorizedException('Authentication token is required');
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      throw new UnauthorizedException('Authentication token is required');
    }

    let payload: {
      sub?: string;
      email?: string;
    };

    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired authentication token',
      );
    }

    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const user = await this.usersService.findById(payload.sub);

    if (!user || !user.isActive) {
      throw new UnauthorizedException(
        'User account is inactive or unavailable',
      );
    }

    request.user = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return true;
  }
}
