import { Injectable } from '@nestjs/common';
import { CustomerService } from 'src/customer/application/customer.service';
import { Customer } from 'src/schemas/customers.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CacheService } from '../../common/cache/cache.service';
import { CustomerDto } from '../../customer/presentation/customer.dto';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { DriverService } from '../../driver/application/driver.service';
import { BusinessService } from '../../business/application/business.service';

@Injectable()
export class AuthService {
  private readonly accessTokenOption: JwtSignOptions;
  private readonly refreshTokenOption: JwtSignOptions;
  private readonly accessTokenStrategy: string;
  private readonly userServices = {};

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly cacheService: CacheService,
    private readonly customerService: CustomerService,
    private readonly driverService: DriverService,
    private readonly businessService: BusinessService,
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

    this.userServices['customer'] = customerService;
    this.userServices['driver'] = driverService;
    this.userServices['business'] = businessService;
  }

  async login(dto: CustomerDto): Promise<CustomerDto> {
    let customer: Customer = await this.customerService.findOne(dto);
    customer = customer ?? (await this.customerService.create(dto));

    const accessToken = this.jwtService.sign(
      {
        tokenType: 'access',
        subject: customer.customerId,
        userType: 'customer',
      },
      this.accessTokenOption,
    );

    await this.saveAccessToken(customer, accessToken);

    const refreshToken = this.jwtService.sign(
      {
        tokenType: 'refresh',
        subject: customer.customerId,
        userType: 'customer',
      },
      this.refreshTokenOption,
    );

    await this.customerService.update({
      ...customer,
      refreshToken: refreshToken,
    });

    return {
      customerId: customer.customerId,
      uuid: customer.uuid,
      customerName: customer.customerName,
      customerPhoneNumber: customer.customerPhoneNumber,
      customerLocation: customer.customerLocation,
      authProvider: customer.authProvider,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async tokenRefresh(request: Request): Promise<CustomerDto> {
    const token = request.headers['authorization'].replace('Bearer ', '');

    const payload = this.jwtService.decode(token);

    const customer: Customer = await this.customerService.findOne({
      userId: payload.subject,
    });

    const accessToken = this.jwtService.sign(
      {
        tokenType: 'access',
        subject: customer.customerId,
        userType: 'customer',
      },
      this.accessTokenOption,
    );

    const refreshToken = this.jwtService.sign(
      {
        tokenType: 'refresh',
        subject: customer.customerId,
        userType: 'customer',
      },
      this.refreshTokenOption,
    );

    await this.saveAccessToken(customer, accessToken);

    await this.customerService.update({
      ...customer,
      refreshToken: refreshToken,
    });

    return {
      customerId: customer.customerId,
      uuid: customer.uuid,
      customerName: customer.customerName,
      customerPhoneNumber: customer.customerPhoneNumber,
      customerLocation: customer.customerLocation,
      authProvider: customer.authProvider,
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

  async decode(token: string): Promise<any> {
    return await this.jwtService.decode(token);
  }

  async getUser(token: string): Promise<any> {
    const payload = await this.jwtService.verify(token);
    if (!payload) {
      throw new UnauthorizedException();
    }

    return await this.userServices[payload.userType].findOne({
      userId: payload.subject,
    });
  }
}
