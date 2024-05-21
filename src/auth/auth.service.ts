import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { CustomerService } from 'src/customer/customer.service';
import { Customer } from 'src/customer/entities/customer.entity';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class AuthService {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly customerService: CustomerService,
  ) {}

  async login(dto: AuthDto): Promise<AuthDto> {
    let customer: Customer = await this.customerService.findOne(dto);
    customer = customer ?? (await this.customerService.create(dto));

    const accessOption: JwtSignOptions = {
      secret: this.configService.get<string>('jwtSecretKey/access'),
      expiresIn: '1h',
    };

    const accessToken = this.jwtService.sign(
      { tokenType: 'access', subject: customer.uuid },
      accessOption,
    );

    this.redis.set(accessToken, JSON.stringify(customer), 'EX', 3600);

    const refreshOption: JwtSignOptions = {
      secret: this.configService.get<string>('jwtSecretKey/refresh'),
      expiresIn: '14d',
    };

    const refreshToken = this.jwtService.sign(
      { tokenType: 'refresh', subject: customer.uuid },
      refreshOption,
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
