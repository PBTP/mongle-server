import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessService } from './application/business.service';
import { Business } from '../schemas/business.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Business])],
  exports: [BusinessService],
  providers: [BusinessService],
})
export class BusinessModule {}
