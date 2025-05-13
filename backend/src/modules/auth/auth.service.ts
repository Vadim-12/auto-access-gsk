import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SendCodeDto } from './dto/send-code.dto';
import { JwtDto, RefreshJwtDto } from './dto/jwt.dto';
import { TokensService } from '../tokens/tokens.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from './dto/sign-up.dto';
import { TwilioService } from '../twilio/twilio.service';
import { Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { LogoutDto } from './dto/logout.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { SignInDto } from './dto/sign-in.dto';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
    private readonly twilioService: TwilioService,
    @InjectRepository(RefreshTokenEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokenEntity>,
    private readonly redisService: RedisService,
  ) {}

  async signUp(dto: SignUpDto) {
    const user = await this.userService.findByPhoneNumber(dto.phoneNumber);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.twilioService.createVerification(dto.phoneNumber);
  }

  async signIn(dto: SignInDto): Promise<JwtDto> {
    // const isCodeCorrect = await this.userService.verifyCode(dto.phoneNumber);
    // if (!isCodeCorrect) {
    //   throw new UnauthorizedException('Invalid phone number or code');
    // }

    const { items: users } = await this.userService.getUsersByFilter({
      phoneNumbers: [dto.phoneNumber],
    });
    if (!users.length) {
      throw new NotFoundException('User not found');
    }
    const user = users[0];

    const payload = { phoneNumber: user.phoneNumber };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);

    return { access, refresh };
  }

  async refreshTokens(dto: RefreshJwtDto): Promise<JwtDto> {
    let jwtPayload: {
      userId: string;
      phoneNumber: string;
    };

    try {
      jwtPayload = await this.tokensService.verifyRefresh(dto.refresh);
    } catch (error: unknown) {
      console.log(error);
      throw new UnauthorizedException();
    }

    const { items: users } = await this.userService.getUsersByFilter({
      userIds: [jwtPayload.userId],
    });

    if (!users.length) {
      throw new NotFoundException('User not found');
    }

    const payload = {
      userId: users[0].userId,
      phoneNumber: users[0].phoneNumber,
      role: users[0].role,
    };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);

    return { access, refresh };
  }

  async logout(dto: LogoutDto): Promise<void> {
    const { refreshToken } = dto;
    await this.refreshTokenRepository.delete({ refreshToken });
  }

  async sendVerificationCode(dto: SendCodeDto): Promise<void> {
    const { phoneNumber } = dto;
    await this.twilioService.createVerification(phoneNumber);
    await this.redisService.set(phoneNumber, 'sended-code');
  }

  async verifyCode(dto: VerifyCodeDto): Promise<void> {
    const { phoneNumber, verificationCode } = dto;
    const verificationStatus = await this.twilioService.checkVerification(
      phoneNumber,
      verificationCode,
    );
    if (verificationStatus !== 'approved') {
      throw new UnauthorizedException('Invalid phone number or code');
    }
    await this.redisService.set(phoneNumber, 'verified');
  }
}
