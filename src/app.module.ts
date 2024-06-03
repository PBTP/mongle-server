import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { loadParameterStoreValue } from './env/ssm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreRegistrationServeyModule } from './pre-registration-servey/pre-registration-servey.module';
import { EmailModule } from './email/email.module';
import { CustomerModule } from './customer/customer.module';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule } from './common/cache/cache.module';
import { LoggerModule } from './config/logger/logger.module';
import { SystemAlarmModule } from './system/system.alarm.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [loadParameterStoreValue],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const datasource = JSON.parse(configService.get('datasource/db'));

        return {
          type: 'postgres',
          host: datasource.host,
          port: datasource.port,
          username: datasource.username,
          password: datasource.password,
          database: datasource.database,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: false,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const datasource = JSON.parse(configService.get('datasource/redis'));
        return {
          config: datasource,
          readyLog: true,
        };
      },
      inject: [ConfigService],
    }),
    EmailModule,
    PreRegistrationServeyModule,
    SystemAlarmModule,
    CustomerModule,
    LoggerModule,
    CacheModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
