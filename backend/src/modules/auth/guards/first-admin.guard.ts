import { Injectable, CanActivate } from '@nestjs/common';
import { UserService } from '../../user/user.service';

@Injectable()
export class FirstAdminGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  async canActivate(): Promise<boolean> {
    const hasAdmin = await this.userService.hasAnyAdmin();
    return !hasAdmin;
  }
}
