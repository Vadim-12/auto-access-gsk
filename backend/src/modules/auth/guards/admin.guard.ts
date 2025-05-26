import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { UserRoleEnum } from '../../../consts';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.log('Checking admin role:', {
      url: request.url,
      method: request.method,
      userId: user?.id,
      role: user?.role,
    });

    if (!user) {
      this.logger.warn('No user found in request');
      return false;
    }

    const isAdmin = user.role === UserRoleEnum.ADMIN;

    this.logger.log('Role check result:', {
      userId: user.id,
      role: user.role,
      isAdmin,
    });

    return isAdmin;
  }
}
