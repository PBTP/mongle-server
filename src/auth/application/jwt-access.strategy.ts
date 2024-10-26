import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CacheService } from '../../common/cache/cache.service';
import { UserDto } from '../presentation/user.dto';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwt/access/secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request & { headers: { authorization?: string } },
    payload: any,
  ): Promise<UserDto> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (payload.tokenType !== 'access') {
      throw new BadRequestException();
    }

    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException('Authorization 헤더에 토큰이 없습니다.');
    }

    return JSON.parse(<string>await this.cacheService.get(token)) as UserDto;
  }
}
