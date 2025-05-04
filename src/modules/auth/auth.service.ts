import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { JwtDto, RefreshJwtDto } from './dto/jwt.dto';
import { TokensService } from '../tokens/tokens.service';
import { UserService } from '../user/user.service';
import { SignUpDto } from '../user/dto/sign-up.dto';
import { generateNumericCode } from 'src/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokensService: TokensService,
    private readonly userService: UserService,
  ) {}

  async signUp(params: SignUpDto) {
    const user = await this.userService.findByPhoneNumber(params.phoneNumber);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    const verificationCode = generateNumericCode(4);
    // тут посылаем СМС с кодом
  }

  async signIn(params: SignInDto): Promise<JwtDto> {
    const isCodeCorrect = await this.userService.verifyCode(params);
    if (!isCodeCorrect) {
      throw new UnauthorizedException('Invalid phone number or code');
    }

    const users = await this.userService.getUsersByFilter({
      phoneNumbers: [params.phoneNumber],
    });
    const userId = users.items[0].userId;

    const payload = { phoneNumber: params.phoneNumber, userId };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);

    return { access, refresh };
  }

  async refreshTokens(params: RefreshJwtDto): Promise<JwtDto> {
    let jwtPayload: {
      userId: string;
      login: string;
    };

    try {
      jwtPayload = this.tokensService.verifyRefresh(params.refresh);
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

    const payload = { login: users[0].login, userId: users[0].userId };
    const access = this.tokensService.signAccess(payload);
    const refresh = this.tokensService.signRefresh(payload);

    return { access, refresh };
  }

  async logout(params: LogoutDto): Promise<void> {
    const { refresh } = params;
    const jwtPayload = this.tokensService.verifyRefresh(refresh);
  }
}
f;
