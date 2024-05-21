import { Injectable } from '@nestjs/common';
import { AuthDto } from '../presentation/auth.dto';
import { CustomerService } from 'src/customer/application/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheService } from "../../common/cache/cache.service";

@Injectable()
export class AuthService {

  private readonly accessTokenOption: JwtSignOptions = {
    expiresIn: '1h',
  }

  private readonly refreshTokenOption: JwtSignOptions = {
    expiresIn: '14d',
  };

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService:CacheService,
    private readonly customerService: CustomerService,
  ) {
    this.accessTokenOption.secret =this.configService.get<string>('jwtSecretKey/access');
    this.refreshTokenOption.secret =this.configService.get<string>('jwtSecretKey/refresh');
  }

  async login(dto: AuthDto): Promise<AuthDto> {
    let customer: Customer = await this.customerService.findOne(dto);
    customer = customer ?? (await this.customerService.create(dto));

    const accessToken = this.jwtService.sign(
      { tokenType: 'access', subject: customer.uuid },
      this.accessTokenOption,
    );

    await this.cacheService.set(accessToken, JSON.stringify(customer), 3600);

    const refreshToken = this.jwtService.sign(
      { tokenType: 'refresh', subject: customer.uuid },
      this.refreshTokenOption,
    );

    await this.customerService.update({
      ...customer,
      refreshToken: refreshToken,
    });

    return {
      ...customer,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async tokenRefresh(request: Request): Promise<AuthDto> {
    const token = request.headers['authorization'].replace('Bearer ', '');

    let payload = this.jwtService.decode(token);

    const customer = await this.customerService.findOne({ uuid: payload.subject });


    const accessToken = this.jwtService.sign(
      { tokenType: 'access', subject: customer.uuid },
      this.accessTokenOption,
    );

    const refreshToken = this.jwtService.sign(
      { tokenType: 'refresh', subject: customer.uuid },
      this.refreshTokenOption,
    );

    await this.customerService.update({
      ...customer,
      refreshToken: refreshToken,
    });

    return {
      ...customer,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

}
