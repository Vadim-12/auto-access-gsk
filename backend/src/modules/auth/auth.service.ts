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
import { UserRoleEnum } from '../../consts';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
  ) {}

  async signUp(dto: SignUpDto) {
    console.log('/api/auth/sign-up [POST] dto', dto);
    const createdUser = await this.userService.create({
      ...dto,
      role: UserRoleEnum.USER,
    });

    const payload = { userId: createdUser.userId, role: createdUser.role };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);
    const refreshToken = this.refreshTokenRepository.create({
      refreshToken: refresh,
      user: createdUser,
    });
    await this.refreshTokenRepository.save(refreshToken);
    return { tokens: { access, refresh }, user: createdUser };
  }

  async signIn(dto: SignInDto): Promise<{
    tokens: { access: string; refresh: string };
    user: UserDto;
  }> {
    console.log('/api/auth/sign-in [POST] dto', dto);
    const user = await this.userService.findByPhoneNumber(dto.phoneNumber);
    if (!user) {
      throw new NotFoundException(
        `Пользователь с номером ${dto.phoneNumber} не найден`,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.passwordHash,
    );
    console.log('/api/auth/sign-in [POST] isPasswordValid', isPasswordValid);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверный пароль');
    }
    const payload = { userId: user.userId, role: user.role };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);
    const refreshToken = this.refreshTokenRepository.create({
      refreshToken: refresh,
      user,
    });
    await this.refreshTokenRepository.save(refreshToken);
    return { tokens: { access, refresh }, user };
  }

  async refreshTokens(dto: RefreshJwtDto): Promise<JwtDto> {
    console.log('/api/auth/refresh [POST] dto', dto);
    let jwtPayload: {
      userId: string;
      role: UserRoleEnum;
    };
    try {
      jwtPayload = await this.tokensService.verifyRefresh(dto.refresh);
    } catch {
      throw new UnauthorizedException(
        'Неверный или просроченный refresh-токен',
      );
    }

    const user = await this.userService.findById(jwtPayload.userId);
    if (!user) {
      throw new NotFoundException(
        `Пользователь с ID ${jwtPayload.userId} не найден`,
      );
    }

    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { user, refreshToken: dto.refresh },
    });
    if (!refreshToken) {
      throw new UnauthorizedException(
        'Неверный или просроченный refresh-токен',
      );
    }
    await this.refreshTokenRepository.delete({
      refreshToken: refreshToken.refreshToken,
    });

    const payload = {
      userId: user.userId,
      role: user.role,
    };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);

    const newRefreshToken = this.refreshTokenRepository.create({
      refreshToken: refresh,
      user,
    });
    await this.refreshTokenRepository.save(newRefreshToken);

    return { access, refresh };
  }

  async logout(dto: LogoutDto): Promise<void> {
    console.log('/api/auth/logout [POST] dto', dto);
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: { refreshToken: dto.refreshToken },
    });
    if (refreshToken) {
      await this.refreshTokenRepository.delete({
        refreshToken: refreshToken.refreshToken,
      });
    }
  }
}
