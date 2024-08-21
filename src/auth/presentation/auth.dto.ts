import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { UserDto } from './user.dto';

export class AuthDto extends UserDto {
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
  refreshToken: string;
}
