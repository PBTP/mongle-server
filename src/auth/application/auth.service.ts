import { Injectable } from '@nestjs/common';
import { AuthDto } from '../presentation/auth.dto';
import { CustomerService } from 'src/customer/application/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../common/cache/cache.service';

@Injectable()
export class AuthService {
  private readonly accessTokenOption: JwtSignOptions;
  private readonly refreshTokenOption: JwtSignOptions;
  private readonly accessTokenStrategy: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly customerService: CustomerService,
  ) {
    this.accessTokenOption = {
      secret: this.configService.get<string>('jwt/access/secret'),
      expiresIn: this.configService.get<number>('jwt/access/expire'),
    };

    this.refreshTokenOption = {
      secret: this.configService.get<string>('jwt/refresh/secret'),
      expiresIn: this.configService.get<number>('jwt/refresh/expire'),
    };

    this.accessTokenStrategy = this.configService.get<string>(
      'jwt/access/strategy',
    );
  }

  async login(dto: AuthDto): Promise<AuthDto> {
    let customer: Customer = await this.customerService.findOne(dto);
    customer = customer ?? (await this.customerService.create(dto));

    const accessToken = this.jwtService.sign(
      { tokenType: 'access', subject: customer.customerId },
      this.accessTokenOption,
    );

    await this.saveAccessToken(customer, accessToken);

    const refreshToken = this.jwtService.sign(
      { tokenType: 'refresh', subject: customer.customerId },
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

    const payload = this.jwtService.decode(token);

    const customer: Customer = await this.customerService.findOne({
      customerId: payload.subject,
    });

    const accessToken = this.jwtService.sign(
      { tokenType: 'access', subject: customer.customerId },
      this.accessTokenOption,
    );

    const refreshToken = this.jwtService.sign(
      { tokenType: 'refresh', subject: customer.customerId },
      this.refreshTokenOption,
    );

    await this.saveAccessToken(customer, accessToken);

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

  private async saveAccessToken(customer: Customer, accessToken: string) {
    const key = `customer:${customer.customerId}:accessToken`;

    if (this.accessTokenStrategy.toLowerCase() === 'unique') {
      this.cacheService.get(key).then((v) => {
        if (v) {
          this.cacheService.del(v);
        }
      });

      await this.cacheService.set(
        key,
        accessToken,
        (this.accessTokenOption.expiresIn as number) / 1000,
      );
    }

    await this.cacheService.set(
      accessToken,
      JSON.stringify({
        ...customer,
        refreshToken: undefined,
      }),
      (this.accessTokenOption.expiresIn as number) / 1000,
    );
  }
}
