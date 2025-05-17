import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtDto, RefreshJwtDto } from './dto/jwt.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { LogoutDto } from './dto/logout.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInDto): Promise<JwtDto> {
    return this.authService.signIn(dto);
  }

  @Post('refresh')
  refreshTokens(@Body() dto: RefreshJwtDto): Promise<JwtDto> {
    return this.authService.refreshTokens(dto);
  }

  @Post('logout')
  logout(@Body() dto: LogoutDto): Promise<void> {
    return this.authService.logout(dto);
  }
}
