import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Customer } from '../../customer/entities/customer.entity';
import { CacheService } from '../../common/cache/cache.service';

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

  async validate(req: Request, payload: any): Promise<Customer> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (payload.tokenType !== 'access') {
      throw new BadRequestException();
    }

    const token = req.headers['authorization'].replace('Bearer ', '');
    return JSON.parse(await this.cacheService.get(token)) as Customer;
  }
}
