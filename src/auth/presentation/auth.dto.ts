import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { TUserDto } from './user.dto';

export type TAuthDto = TUserDto & {
  accessToken?: string;
  refreshToken?: string;
};

export class AuthDto implements TAuthDto {
  @ApiProperty({
    description: 'Access Token',
    type: String,
  })
  @IsOptional()
  accessToken?: string;

  @ApiProperty({
    description: 'Refresh Token',
    type: String,
  })
  @IsOptional()
  refreshToken?: string;
}
