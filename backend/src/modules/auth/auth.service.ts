import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtDto, RefreshJwtDto } from './dto/jwt.dto';
import { TokensService } from '../tokens/tokens.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LogoutDto } from './dto/logout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SignInDto } from './dto/sign-in.dto';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from 'src/consts';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async signUp(dto: SignUpDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    delete dto.password;
    await this.userService.create({ ...dto, passwordHash });
  }

  async signIn(dto: SignInDto): Promise<JwtDto> {
    const user = await this.userService.findByPhoneNumber(dto.phoneNumber);
    if (!user) {
      throw new NotFoundException(
        `User with phoneNumber ${dto.phoneNumber} not found`,
      );
    }
    const payload = { userId: user.userId, role: user.role };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);
    return { access, refresh };
  }

  async refreshTokens(dto: RefreshJwtDto): Promise<JwtDto> {
    let jwtPayload: {
      userId: string;
      role: UserRoleEnum;
    };
    try {
      jwtPayload = await this.tokensService.verifyRefresh(dto.refresh);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    const user = await this.userService.findById(jwtPayload.userId);
    if (!user) {
      throw new NotFoundException(
        `User with ID ${jwtPayload.userId} not found`,
      );
    }

    const payload = {
      userId: user.userId,
      role: user.role,
    };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);
    return { access, refresh };
  }

  async logout(dto: LogoutDto): Promise<void> {
    const { refreshToken } = dto;
    await this.refreshTokenRepository.delete({ refreshToken });
  }
}
