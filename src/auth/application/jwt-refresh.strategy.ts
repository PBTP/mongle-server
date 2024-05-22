import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CustomerService } from 'src/customer/application/customer.service';
import { Customer } from '../../customer/entities/customer.entity';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor(
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwt/refresh/secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<Customer> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (payload.tokenType !== 'refresh') {
      throw new BadRequestException();
    }

    const token = req.headers['authorization'].replace('Bearer ', '');
    return await this.customerService.findOne({ refreshToken: token });
  }
}
