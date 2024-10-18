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
import { ImageModule } from './common/image/image.module';
import { CloudModule } from './common/cloud/cloud.module';
import { ChatModule } from './chat/chat.module';
import { PetModule } from './pet/pet.module';
import { MetricsModule } from './system/matrics/metrics.module';
import * as process from 'node:process';
import { TestModule } from './test/test.module';

const appModules = [
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
        logging: datasource.logging,
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
  ImageModule,
  CloudModule,
  ChatModule,
  PetModule,
];

// 환경별 모듈 추가
profile('local', MetricsModule);
profile('local', TestModule);

@Module({
  imports: appModules,
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

function profile(env: string, module: any) {
  if (process.env.NODE_ENV === env) {
    appModules.push(module);
  }
}
