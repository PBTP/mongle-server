import {
  Controller,
  Post,
  Body,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthDto } from './auth.dto';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerDto } from '../../customer/presentation/customer.dto';
import { Auth } from '../decorator/auth.decorator';
import { CustomerService } from '../../customer/application/customer.service';
import { Customer } from 'src/schemas/customers.entity';
import { VerifyPhoneDto } from './verify-phone.dto';
import { AligoService } from 'src/sms/application/aligo.service';
import { PhoneVerificationService } from 'src/sms/application/phone-verification.service';
import { CreateCustomerDto } from './create-customer.dto';
import { PhoneVerificationRequestDto } from './phone-verification-request.dto';

@ApiTags('인증 관련 API')
@Controller('/v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly phoneVerificationService: PhoneVerificationService,
    private readonly aligoService: AligoService,
    private readonly customerService: CustomerService,
  ) {}

  @ApiOperation({
    summary: '로그인',
    description: `Resource Server에서 제공한 식별자를 통해 고객의 정보를 확인하고 토큰을 발급합니다.
       (고객의 정보가 없을 경우 신규 고객으로 등록함)`,
  })
  @ApiCreatedResponse({ type: AuthDto, description: '로그인 성공' })
  @ApiResponse({
    status: 401,
    description: `Unauthorized / 요청한 Access Token이 만료되었습니다. 토큰을 갱신하세요`,
  })
  @Post('/login')
  async login(@Body() dto: CustomerDto) {
    return await this.authService.login(dto);
  }

  @ApiOperation({
    summary: '토큰 갱신',
    description: `Refresh Token을 통해 Access Token을 재발급합니다.`,
  })
  @ApiCreatedResponse({ type: AuthDto, description: '갱신 성공' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized / 요청한 Refresh Token에 해당하는 고객이 없습니다.',
  })
  @Auth('refresh')
  @Post('/refresh')
  async refresh(@Req() req: Request): Promise<AuthDto> {
    return await this.authService.tokenRefresh(req);
  }

  @ApiOperation({
    summary: 'SMS 인증 요청',
    description: `전화번호로 SMS 인증 코드를 요청합니다.`,
  })
  @ApiCreatedResponse({ description: 'SMS 인증 코드 전송 성공' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request / 요청한 데이터가 유효하지 않습니다.',
  })
  @Post('/request-verification')
  async requestVerification(@Body() dto: PhoneVerificationRequestDto) {
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    await this.aligoService.sendVerificationCode(
      dto.phoneNumber,
      verificationCode,
    );

    await this.phoneVerificationService.createVerification(
      dto.phoneNumber,
      verificationCode,
    );

    return { message: '인증 코드가 전송되었습니다.' };
  }

  @ApiOperation({
    summary: 'SMS 인증 코드 확인',
    description: `SMS 인증 코드를 확인하고 verificationId를 반환합니다.`,
  })
  @ApiCreatedResponse({
    description: '인증 코드 확인 성공',
    schema: { example: { verificationId: 'verification-id' } },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request / 인증 코드가 유효하지 않습니다.',
  })
  @Post('/verify-code')
  async verifyCode(@Body() dto: VerifyPhoneDto) {
    const verificationId = await this.phoneVerificationService.verifyCode(
      dto.phoneNumber,
      dto.verificationCode,
    );

    if (!verificationId) {
      throw new BadRequestException('인증 코드가 유효하지 않습니다.');
    }

    return { verificationId };
  }

  @ApiOperation({
    summary: '회원 가입',
    description: `기타 정보를 입력하여 회원 가입을 완료합니다.`,
  })
  @ApiCreatedResponse({ description: '회원 가입 성공' })
  @ApiResponse({
    status: 400,
    description: 'Bad Request / 요청한 데이터가 유효하지 않습니다.',
  })
  @Post('/signup')
  async signup(@Body() dto: CreateCustomerDto): Promise<Customer> {
    const isVerified = await this.phoneVerificationService.isVerified(
      dto.phoneNumber,
      dto.verificationId,
    );

    if (!isVerified) {
      throw new BadRequestException('인증되지 않은 전화번호입니다.');
    }

    return await this.customerService.create(dto);
  }
}
