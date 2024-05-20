import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CustomerService } from 'src/customer/customer.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwtSecretKey'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(uuid: any): Promise<any> {
    if (!uuid) {
      throw new UnauthorizedException();
    }

    return await this.customerService.findOne(uuid);
  }
}
