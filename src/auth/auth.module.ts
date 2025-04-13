import { Global, Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { CustomerModule } from '@customer/customer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './application/jwt-access.strategy';
import { JwtRefreshStrategy } from './application/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from "@common/cache/cache.module";
import { DriverModule } from "@driver/driver.module";
import { BusinessModule } from "@business/business.module";
import { UserModule } from './user.module';
import { SecurityModule } from './application/security.module';
import { SmsModule } from "@common/sender/sms/sms.module";

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt/access/secret'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'access' }),
    SmsModule,
    UserModule,
    CacheModule,
    DriverModule,
    SecurityModule,
    BusinessModule,
    CustomerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule { }
