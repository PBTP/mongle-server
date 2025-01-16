import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { UserDto } from './user.dto';
import { CrudGroup } from '../../common/validation/validation.data';

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
  refreshToken?: string;
}

export interface OtpRequest {
  secret: string;
  otp: string;
}

export class OtpRequestDto implements OtpRequest {
  @ApiProperty({
    description: 'OTP 생성에 사용될 키 ex) 전화번호',
    type: String,
    required: true,
  })
  @IsNotEmpty({
    groups: [CrudGroup.create, CrudGroup.update],
  })
  secret: string;

  @ApiProperty({
    type: String,
    required: false,
    description: 'OTP키',
  })
  @IsNotEmpty({
    groups: [CrudGroup.update],
  })
  @IsOptional()
  otp: string;
}

export interface OtpResponse {
  otp: string;
  verified: boolean;
}

export class OtpResponseDto implements OtpResponse {
  @ApiProperty({
    description: 'OTP',
    type: String,
    readOnly: true,
  })
  otp: string;

  @ApiProperty({
    description: 'OTP 검증 결과',
    type: Boolean,
    readOnly: true,
  })
  verified: boolean;

  @ApiProperty({
    description: '전송 매체',
    type: String,
    readOnly: true,
  })
  sendType: string;
}
