import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomerDto } from '../../customer/presentation/customer.dto';

@ApiTags('인증 관련 API')
@Controller('/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '로그인',
    description: `Resource Server에서 제공한 식별자를 통해 고객의 정보를 확인 하고 토큰을 발급합니다.
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
  @ApiBearerAuth()
  @Post('/refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: Request): Promise<AuthDto> {
    return await this.authService.tokenRefresh(req);
  }
}
