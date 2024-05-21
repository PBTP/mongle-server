import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { AuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Post('/refresh')
  @UseGuards(AuthGuard('refresh'))
  async refresh(@Req() req: Request) {
    return await this.authService.tokenRefresh(req);
  }
}
