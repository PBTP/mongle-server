import { Global, Module } from '@nestjs/common';
import { AuthService } from './application/auth.service';
import { AuthController } from './presentation/auth.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './application/jwt-access.strategy';
import { JwtRefreshStrategy } from './application/jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '../common/cache/cache.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneVerification } from 'src/schemas/phone-verification.entity';
import { PhoneVerificationService } from 'src/sms/application/phone-verification.service';
import { SmsModule } from 'src/sms/sms.module';

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
    CacheModule,
    CustomerModule,
    TypeOrmModule.forFeature([PhoneVerification]),
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    PhoneVerificationService,
  ],
  exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule {}
