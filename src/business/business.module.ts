import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BusinessService} from './application/business.service';
import {BusinessEntity} from '../schemas/business.entity';
import {BusinessController} from './presentation/business.controller';
import {BUSINESS_REPOSITORY, BusinessRepository} from './port/business.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessEntity])],
  exports: [BusinessService],
  providers: [
    BusinessService,
    {
      provide: BUSINESS_REPOSITORY,
      useClass: BusinessRepository,
    },
  ],
  controllers: [BusinessController],
})
export class BusinessModule {}
