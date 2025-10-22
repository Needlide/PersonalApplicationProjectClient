import { UserDto } from './user.dto';

export interface LoginResponseDto {
  token: string;
  refreshToken: string;
  expiration: any;
  user: UserDto;
}
