import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAccessStrategy } from './jwt-access.strategy';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { PassportModule } from '@nestjs/passport';
import { CacheModule } from '../common/cache/cache.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey/access'),
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'access' }),
    CacheModule,
    CustomerModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [AuthService, JwtAccessStrategy, JwtRefreshStrategy],
})
export class AuthModule {}
