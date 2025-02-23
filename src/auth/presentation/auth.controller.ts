import { Body, Controller, HttpStatus, Post, Query, Req } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthDto, OtpRequestDto, OtpResponseDto } from './auth.dto';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKey, Auth, CurrentUser } from '../decorator/auth.decorator';
import { UserDto, UserGroup } from './user.dto';
import { GroupValidation } from '../../common/validation/validation.decorator';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Builder } from 'builder-pattern';
import { CrudGroup } from '../../common/validation/validation.data';
import { ResponseEntity } from '../../common/dto/response.entity';

@ApiTags('인증 관련 API')
@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: `Resource Server에서 제공한 식별자를 통해 고객의 정보를 확인 하고 토큰을 발급합니다.
       (고객의 정보가 없을 경우 신규 고객으로 등록함)`,
  })
  @ApiCreatedResponse({
    type: AuthDto,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 401,
    description: `Unauthorized / 요청한 Access Token이 만료되었습니다. 토큰을 갱신하세요`,
  })
  @Post('/login')
  @GroupValidation([UserGroup.login])
  async login(@Body() dto: UserDto): Promise<ResponseEntity<AuthDto>> {
    return ResponseEntity.OK(await this.authService.login(dto));
  }

  @ApiOperation({
    summary: '토큰 갱신',
    description: `Refresh Token을 통해 Access Token을 재발급합니다.`,
  })
  @ApiCreatedResponse({
    type: AuthDto,
    description: '갱신 성공',
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized / 요청한 Refresh Token에 해당하는 고객이 없습니다.',
  })
  @Auth(HttpStatus.CREATED, 'refresh')
  @Post('/refresh')
  async refresh(
    @Req()
    req: Request & {
      headers: {
        authorization?: string;
      };
    },
  ): Promise<ResponseEntity<AuthDto>> {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException(
        'Authorization 헤더에 Bearer Token이 없습니다..',
      );
    }

    return ResponseEntity.CREATED(
      await this.authService.tokenRefresh(token),
      'refresh token 발급 완료',
    );
  }

  @ApiOperation({
    summary: 'OTP 발급 API',
    description: `유저의 수신정보를 통해 OTP를 발급한 후 이를 전달받은 수신정보를 토대로 OTP을 전송합니다.\n 
    수신 정보는 전화번호, 이메일 등이 될 수 있습니다.\n sendType을 보내지 않으면 OTP를 생성만 합니다.\n
    sendType을 보내면 해당 수단으로 OTP를 전송합니다. ex) sms, email\n
    OTP는 10분동안 유효합니다.`,
  })
  @ApiCreatedResponse({
    type: OtpResponseDto,
    description: 'OTP 발급 성공',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / 요청한 고객이 없습니다.',
  })
  @ApiQuery({
    name: 'sendType',
    description: 'OTP 전송 방법 ex) sms, email',
    required: false,
    type: String,
  })
  @GroupValidation([CrudGroup.create])
  @ApiKey(HttpStatus.CREATED)
  @Post('/otp')
  async generatedOtpAndSend(
    @Body() dto: OtpRequestDto,
    @Query('sendType') sendType?: string,
  ): Promise<ResponseEntity<OtpResponseDto>> {
    if (sendType) {
      const generatedOtpNumber = await this.authService.sendOtp(
        sendType,
        dto.secret,
      );

      return ResponseEntity.CREATED(
        Builder<OtpResponseDto>().otp(generatedOtpNumber).build(),
      );
    }

    return ResponseEntity.CREATED(
      Builder<OtpResponseDto>()
        .otp(await this.authService.generateOtp(dto.secret))
        .build(),
    );
  }

  @ApiOperation({
    summary: 'OTP 검증',
    description: `유저의 초기 발급한 수신정보 통해 OTP를 검증합니다.\n
    검증이 성공하면 유저의 정보를 업데이트 합니다.\n`,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized / 요청한 고객이 없습니다.',
  })
  @ApiOkResponse({
    type: OtpResponseDto,
    description: 'OTP 검증 성공',
  })
  @GroupValidation([CrudGroup.update])
  @Post('/otp/verification')
  async otpVerify(
    @CurrentUser() user: UserDto,
    @Body() dto: OtpRequestDto,
  ): Promise<ResponseEntity<OtpResponseDto>> {
    const validated = await this.authService.otpVerifyAndUserUpdate(
      user,
      dto.secret,
      dto.otp,
    );

    return ResponseEntity.OK(
      Builder<OtpResponseDto>().otp(dto.otp).verified(validated).build(),
    );
  }
}
