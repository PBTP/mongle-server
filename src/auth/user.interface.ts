import { UserDto } from './presentation/user.dto';

export interface IUserService {
  findOne(dto: Partial<UserDto>): Promise<UserDto>;
}
