import { UserDto } from '../../user/dto/user.dto';

export interface AuthResponseDto {
  tokens: { access: string; refresh: string };
  user: UserDto;
}
