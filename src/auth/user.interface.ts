import { UserDto, UserType } from './presentation/user.dto';
import { TAuthDto } from './presentation/auth.dto';

export interface IUserService {
  readonly userType: UserType;

  findOne(dto: Partial<TAuthDto>): Promise<UserDto>;

  create(dto: UserDto): Promise<UserDto>;

  update(dto: UserDto): Promise<UserDto>;

  toUserDto(user: any): UserDto;
}
