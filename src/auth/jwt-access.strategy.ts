import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Customer } from '../customer/entities/customer.entity';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwtSecretKey/access'),
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
    return JSON.parse(await this.redis.get(token)) as Customer;
  }
}
