import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './application/business.service';
import { Business } from '../schemas/business.entity';
import { BusinessController } from './presentation/business.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  exports: [BusinessService],
  providers: [BusinessService],
  controllers: [BusinessController],
})
export class BusinessModule {}
