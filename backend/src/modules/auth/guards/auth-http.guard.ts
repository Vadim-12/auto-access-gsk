import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthHttpGuard implements CanActivate {
  private readonly logger = new Logger(AuthHttpGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    this.logger.log('Checking authorization:', {
      url: request.url,
      method: request.method,
      hasAuthHeader: !!authHeader,
    });

    if (!authHeader) {
      this.logger.warn('No authorization header');
      throw new UnauthorizedException('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    this.logger.log('Token:', token.substring(0, 10) + '...');

    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        algorithms: [this.config.get('JWT_ALG')],
      });
      this.logger.log('Token verified successfully:', {
        userId: decoded.userId,
        roles: decoded.roles,
      });
      (request as any).user = decoded;
      return true;
    } catch (error: unknown) {
      if (error instanceof JsonWebTokenError) {
        this.logger.warn('Invalid access token:', error.message);
        throw new UnauthorizedException('Invalid access token');
      }
      if (error instanceof TokenExpiredError) {
        this.logger.warn('Access token expired:', error.message);
        throw new UnauthorizedException('Access token expired');
      }
      this.logger.warn('Unknown authentication error:', error);
      throw new UnauthorizedException(
        `Unknown HTTP authentication error: ${(error as Error).message}`,
      );
    }
  }
}
