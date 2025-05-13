import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class TokensService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signAccess(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_ACCESS_SECRET'),
      algorithm: this.config.get('JWT_ALG'),
      expiresIn: this.config.get('JWT_ACCESS_EXP'),
    });
  }

  signRefresh(payload: any) {
    return this.jwtService.sign(payload, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
      algorithm: this.config.get('JWT_ALG'),
      expiresIn: this.config.get('JWT_REFRESH_EXP'),
    });
  }

  verifyAccess(token: string): Promise<any> {
    try {
      return this.jwtService.verify(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
        algorithms: [this.config.get('JWT_ALG')],
      });
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid access token');
      }
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access token expired');
      }
      throw new UnauthorizedException('Access token verification failed');
    }
  }

  verifyRefresh(token: string): Promise<any> {
    try {
      const jwtPayload = this.jwtService.verify(token, {
        secret: this.config.get('JWT_REFRESH_SECRET'),
        algorithms: [this.config.get('JWT_ALG')],
      });
      return jwtPayload;
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      }
      throw new UnauthorizedException('Refresh token verification failed');
    }
  }
}
