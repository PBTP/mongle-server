import { ConfigService } from '@nestjs/config';
import { BadRequestException, UnauthorizedException } from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomerService } from 'src/customer/application/customer.service';
import { BusinessService } from '../../business/application/business.service';
import { DriverService } from '../../driver/application/driver.service';
import { IUserService } from '../user.interface';
import { TUserDto } from '../presentation/user.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  private readonly userServices: {
    [key: string]: IUserService;
  } = {};

  constructor(
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
    private readonly businessService: BusinessService,
    private readonly driverService: DriverService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwt/refresh/secret'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      passReqToCallback: true,
    });

    this.userServices.customer = customerService;
    this.userServices.business = businessService;
    this.userServices.driver = driverService;
  }

  async validate(req: Request, payload: any): Promise<TUserDto> {
    if (!payload) {
      throw new UnauthorizedException();
    }

    if (payload.tokenType !== 'refresh') {
      throw new BadRequestException();
    }

    return await this.userServices[payload.userType].findOne({
      userId: payload.subject,
    });
  }
}
